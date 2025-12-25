import { Module } from '@nestjs/common';
import { FileProcessService } from './file-process.service';
import { FileProcessController } from './file-process.controller';
import { FileStrategyFactory } from './strategies/file-strategy.factory';
import { PDFProcessStrategy } from './strategies/implementations/pdf-process.strategy';
import { VectorStoreService } from 'src/services/vector-store.service';
import { FileMetadataService } from './file-metadata.service';
import { JSONProcessStrategy } from './strategies/implementations/json-process.strategy';

@Module({
  controllers: [FileProcessController],
  providers: [
    FileProcessService,
    FileStrategyFactory,
    PDFProcessStrategy,
    JSONProcessStrategy,
    VectorStoreService,
    FileMetadataService,
  ],
  exports: [FileProcessService],
})
export class FileProcessModule {}
