import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DocumentDto } from './dto/document.dto';
import { FileStrategyFactory } from './strategies/file-strategy.factory';
import { FileMetadataService } from './file-metadata.service';
import { VectorStoreService } from 'src/services/vector-store.service';
import { existsSync } from 'fs';
import path from 'path';
import { FILE_BASE_PATH } from 'src/utils/constants/common.constants';

@Injectable()
export class FileProcessService {
  constructor(
    private readonly fileStrategyFactory: FileStrategyFactory,
    private readonly fileMetadata: FileMetadataService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  validateFile(documentDto: DocumentDto) {
    const filePath = `${FILE_BASE_PATH}/${documentDto.file}`;
    const resolvedPath = path.resolve(filePath);

    // Check if the file exists
    if (!existsSync(resolvedPath)) {
      throw new BadRequestException(
        `File does not exist at path: ${resolvedPath}`,
      );
    }

    // Get file metadata
    const file = this.fileMetadata.getMetadata(documentDto.file);

    if (!file) {
      throw new BadRequestException(
        `File metadata not found for ID: ${documentDto.file}`,
      );
    }

    return file;
  }

  private normalizeFileType(fileType: string): string {
    // Convert MIME type to file extension if needed
    const mimeTypeMap: Record<string, string> = {
      'application/pdf': 'pdf',
      'text/plain': 'txt',
      'text/csv': 'csv',
      'application/json': 'json',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'text/html': 'html',
      'application/xml': 'xml',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'pptx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'application/vnd.ms-excel': 'xls',
    };

    // Return the mapped extension if it exists, otherwise return the original type
    return mimeTypeMap[fileType.toLowerCase()] || fileType.toLowerCase();
  }

  async uploadFile(documentDto: DocumentDto) {
    if (!documentDto.file) {
      throw new BadRequestException('File ID is required');
    }

    try {
      // Validate file and it's metadata exists
      // and return the metadata
      const file = this.validateFile(documentDto);

      // Normalize the file type to ensure it matches the strategy mapping
      const normalizedFileType = this.normalizeFileType(file.type);

      const fileProcessStrategy =
        this.fileStrategyFactory.getStrategy(normalizedFileType);

      if (!fileProcessStrategy) {
        throw new BadRequestException(
          `No processing strategy available for file type: ${normalizedFileType}`,
        );
      }

      const docs = await fileProcessStrategy.parse(file.path);
      const embeddings = await fileProcessStrategy.chunk(docs);

      await this.vectorStoreService.addDocuments(embeddings);

      // TODO: 实现一个更完善的清理策略
      // Remove relavant file metadata
      this.fileMetadata.removeMetadata(file.id);

      // TODO: 实现更统一的返回
      return {
        success: true,
        message: 'File processed and added to vector store successfully',
        documentCount: embeddings.length,
      };
    } catch (error: unknown) {
      // Handle specific error types
      if (error instanceof BadRequestException) {
        throw error;
      }

      // For all other errors, throw a generic internal server error
      throw new InternalServerErrorException(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Failed to process file: ${(error as Error)?.message || error}`,
      );
    }
  }
}
