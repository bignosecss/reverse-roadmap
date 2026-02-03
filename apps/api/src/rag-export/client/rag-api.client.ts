import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type {
  SemanticContentDocument,
  SemanticDocumentUnion,
  SemanticNodeDocument,
  SemanticRootDocument,
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
  private readonly nativeDocumentEndpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    let ragApiUrl = this.configService.get<string>('RAG_API_URL');
    if (!ragApiUrl) {
      throw new Error('RAG_API_URL configuration is required for RagApiClient');
    }
    ragApiUrl = ragApiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.nativeDocumentEndpoint = `${ragApiUrl}/add-native-documents`;
  }

  async uploadDocuments(semanticDocuments: {
    semanticRoot: SemanticRootDocument;
    semanticNodes: SemanticNodeDocument[];
    semanticContents: SemanticContentDocument[];
    all: SemanticDocumentUnion[];
  }): Promise<UploadResult> {
    try {
      this.logger.log(
        `Uploading ${semanticDocuments.all.length} documents to RAG API (${this.nativeDocumentEndpoint})`,
      );

      await firstValueFrom(
        this.httpService.post(this.nativeDocumentEndpoint, {
          docs: semanticDocuments.all,
        }),
      );

      return {
        success: true,
        message: `Successfully uploaded ${semanticDocuments.all.length} documents`,
        uploadedCount: semanticDocuments.all.length,
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
        failedCount: semanticDocuments.all.length,
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
