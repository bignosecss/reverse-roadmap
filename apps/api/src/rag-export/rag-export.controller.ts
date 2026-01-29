import { Controller, Post, HttpCode, Param } from '@nestjs/common';
import { RagExportService, ExportResult } from './rag-export.service';

@Controller('rag-export')
export class RagExportController {
  constructor(private readonly ragExportService: RagExportService) {}

  /**
   * Export the tree related information to RAG system for embedding
   * POST /api/rag-export/:id/export
   */
  @Post(':id/export')
  @HttpCode(200)
  async exportToRag(@Param('id') id: string): Promise<ExportResult> {
    return await this.ragExportService.exportToRag(id);
  }
}
