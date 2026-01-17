import { Controller, Post, HttpCode, Param } from '@nestjs/common';
import { RagExportService, ExportResult } from './rag-export.service';

@Controller('rag-export')
export class RagExportController {
  constructor(private readonly ragExportService: RagExportService) {}

  /**
   * Export a tree to RAG system for embedding
   * POST /api/rag-export/:id/export
   */
  @Post(':id/export')
  @HttpCode(200)
  async exportToRag(@Param('id') id: string): Promise<ExportResult> {
    return await this.ragExportService.exportToRag(id);
  }

  /**
   * Re-export a tree to RAG system (delete existing and upload fresh)
   * POST /api/rag-export/:id/reexport
   */
  @Post(':id/reexport')
  @HttpCode(200)
  async reexportToRag(@Param('id') id: string): Promise<ExportResult> {
    return await this.ragExportService.reexportToRag(id);
  }
}
