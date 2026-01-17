import { Injectable, Logger } from '@nestjs/common';
import { RagDataFetcher } from './data-fetcher/rag-data.fetcher';
import { RagDocumentTransformer } from './transformer/rag-document.transformer';
import { RagApiClient } from './client/rag-api.client';

export interface ExportResult {
  success: boolean;
  message: string;
  rootId: string;
  totalDocuments: number;
}

@Injectable()
export class RagExportService {
  private readonly logger = new Logger(RagExportService.name);

  constructor(
    private readonly ragDataFetcher: RagDataFetcher,
    private readonly ragDocumentTransformer: RagDocumentTransformer,
    private readonly ragApiClient: RagApiClient,
  ) {}

  async exportToRag(rootId: string): Promise<ExportResult> {
    this.logger.log(`Starting RAG export for root: ${rootId}`);

    try {
      // Step 1: Fetch all data from database
      this.logger.log(`Fetching data for root: ${rootId}`);
      const data = await this.ragDataFetcher.fetchAll(rootId);

      // Step 2: Transform data into RAG documents
      this.logger.log('Transforming data into RAG documents');
      const { rootDocument, nodeDocuments, contentDocuments } =
        this.ragDocumentTransformer.transformAll(data);

      // Step 3: Upload documents to RAG API
      this.logger.log(
        `Uploading ${1 + nodeDocuments.length + contentDocuments.length} documents to RAG API`,
      );
      const uploadResult = await this.ragApiClient.uploadDocuments(
        rootDocument,
        nodeDocuments,
        contentDocuments,
      );

      if (uploadResult.success) {
        this.logger.log(
          `Successfully exported ${rootId} to RAG (${uploadResult.uploadedCount} documents)`,
        );
        return {
          success: true,
          message: `Successfully exported ${uploadResult.uploadedCount} documents to RAG`,
          rootId,
          totalDocuments: uploadResult.uploadedCount || 0,
        };
      } else {
        this.logger.error(
          `Failed to export ${rootId} to RAG: ${uploadResult.message}`,
        );
        return {
          success: false,
          message: uploadResult.message,
          rootId,
          totalDocuments: 0,
        };
      }
    } catch (error: unknown) {
      this.logger.error(
        `Error during RAG export for ${rootId}: ${this.getErrorMessage(error)}`,
      );
      return {
        success: false,
        message: `Export failed: ${this.getErrorMessage(error)}`,
        rootId,
        totalDocuments: 0,
      };
    }
  }

  async reexportToRag(rootId: string): Promise<ExportResult> {
    this.logger.log(`Starting RAG re-export for root: ${rootId}`);

    try {
      // Delete existing documents first
      this.logger.log(`Deleting existing documents for root: ${rootId}`);
      await this.ragApiClient.deleteDocuments(rootId);

      // Export fresh data
      return await this.exportToRag(rootId);
    } catch (error: unknown) {
      this.logger.error(
        `Error during RAG re-export for ${rootId}: ${this.getErrorMessage(error)}`,
      );
      return {
        success: false,
        message: `Re-export failed: ${this.getErrorMessage(error)}`,
        rootId,
        totalDocuments: 0,
      };
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
