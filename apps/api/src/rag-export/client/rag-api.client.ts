import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type {
  RrRootDocument,
  RrNodeDocument,
  RrContentDocument,
} from '@repo/shared';
import { firstValueFrom } from 'rxjs';

export interface UploadResult {
  success: boolean;
  message: string;
  uploadedCount?: number;
  failedCount?: number;
}

export interface RagApiError {
  message: string;
  statusCode?: number;
}

@Injectable()
export class RagApiClient {
  private readonly logger = new Logger(RagApiClient.name);
  private readonly ragApiUrl: string;
  private readonly nativeDocumentEndpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const ragApiUrl = this.configService.get<string>('RAG_API_URL');
    if (!ragApiUrl) {
      throw new Error('RAG_API_URL configuration is required for RagApiClient');
    }
    this.ragApiUrl = ragApiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.nativeDocumentEndpoint = `${this.ragApiUrl}/file-process/native-documents`;
  }

  async uploadDocuments(
    rootDocument: RrRootDocument,
    nodeDocuments: RrNodeDocument[],
    contentDocuments: RrContentDocument[],
  ): Promise<UploadResult> {
    const allDocuments = [
      { type: 'root', data: rootDocument },
      ...nodeDocuments.map((doc) => ({ type: 'node', data: doc })),
      ...contentDocuments.map((doc) => ({ type: 'content', data: doc })),
    ];

    // TODO: Remove this skip flag for production
    const skipRealUpload = this.configService.get<boolean>(
      'RAG_SKIP_UPLOAD',
      false,
    );

    if (skipRealUpload) {
      this.logger.log(
        `Skipping real upload (RAG_SKIP_UPLOAD=true). Returning mock result for ${allDocuments.length} documents.`,
      );

      // Log document details for testing
      this.logger.debug(
        `Root document: ${JSON.stringify(rootDocument, null, 2)}`,
      );
      this.logger.debug(`Node documents count: ${nodeDocuments.length}`);
      this.logger.debug(`Content documents count: ${contentDocuments.length}`);
      this.logger.debug(
        `Content documents: ${JSON.stringify(contentDocuments[0], null, 2)}`,
      );

      return {
        success: true,
        message: `[TEST MODE] Mock upload for ${allDocuments.length} documents (no real API call)`,
        uploadedCount: allDocuments.length,
        failedCount: 0,
      };
    }

    try {
      this.logger.log(
        `Uploading ${allDocuments.length} documents to RAG API (${this.ragApiUrl})`,
      );

      await firstValueFrom(
        this.httpService.post(this.nativeDocumentEndpoint, {
          rootId: rootDocument.id,
          documents: allDocuments,
        }),
      );

      this.logger.log(
        `Successfully uploaded ${allDocuments.length} documents to RAG API`,
      );

      return {
        success: true,
        message: `Successfully uploaded ${allDocuments.length} documents`,
        uploadedCount: allDocuments.length,
        failedCount: 0,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to upload documents to RAG API: ${this.getErrorMessage(error)}`,
      );

      return {
        success: false,
        message: `Failed to upload documents: ${this.getErrorMessage(error)}`,
        uploadedCount: 0,
        failedCount: allDocuments.length,
      };
    }
  }

  async deleteDocuments(rootId: string): Promise<void> {
    try {
      this.logger.log(`Deleting documents for root ${rootId} from RAG API`);

      await firstValueFrom(
        this.httpService.delete(`${this.nativeDocumentEndpoint}/${rootId}`),
      );

      this.logger.log(`Successfully deleted documents for root ${rootId}`);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to delete documents for root ${rootId}: ${this.getErrorMessage(error)}`,
      );

      throw new Error(
        `Failed to delete documents: ${this.getErrorMessage(error)}`,
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await firstValueFrom(this.httpService.get(`${this.ragApiUrl}/health`));
      return true;
    } catch {
      return false;
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Unknown error occurred';
  }
}
