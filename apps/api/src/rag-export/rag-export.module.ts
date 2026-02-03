import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RagExportService } from './rag-export.service';
import { RagExportController } from './rag-export.controller';
import { RrRootModule } from 'src/rr-root/rr-root.module';
import { RrNodeModule } from 'src/rr-node/rr-node.module';
import { RrContentModule } from 'src/rr-content/rr-content.module';
import { RagDataFetcher } from './data-fetcher/rag-data.fetcher';
import { RagDocumentTransformer } from './transformer/rag-document.transformer';
import { SemanticDocumentTransformer } from './transformer/semantic-document.transformer';
import { RagApiClient } from './client/rag-api.client';
import { HierarchyMapper } from './utils/hierarchy.mapper';
import { StatusCounter } from './utils/status.counter';
import { TipTapConverter } from './utils/tiptap.converter';

@Module({
  imports: [HttpModule, RrRootModule, RrNodeModule, RrContentModule],
  controllers: [RagExportController],
  providers: [
    RagExportService,
    RagDataFetcher,
    RagDocumentTransformer,
    SemanticDocumentTransformer,
    RagApiClient,
    HierarchyMapper,
    StatusCounter,
    TipTapConverter,
  ],
})
export class RagExportModule {}
