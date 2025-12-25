import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileProcessService } from './file-process.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_BASE_PATH } from 'src/utils/constants/common.constants';
import { extname, join } from 'path';
import { DocumentDto } from './dto/document.dto';
import { FileMetadataService, FileMetadata } from './file-metadata.service';

@Controller('file-process')
export class FileProcessController {
  constructor(
    private readonly fileProcessService: FileProcessService,
    private readonly fileMetadataService: FileMetadataService,
  ) {}

  @Post('upload-document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: FILE_BASE_PATH,
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @HttpCode(200)
  async loadFile(
    @Body() documentDto: DocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const fileId = file.filename;

      const fileMetadata: FileMetadata = {
        id: fileId,
        path: join(FILE_BASE_PATH, file.filename),
        type: file.mimetype || extname(file.originalname).substring(1), // Use extension if mimetype is not available
        createdAt: new Date(),
        originalName: file.originalname,
        size: file.size,
      };

      // Store metadata in memory
      this.fileMetadataService.storeMetadata(fileId, fileMetadata);

      if (file.filename) {
        documentDto.file = fileId;
      }
    }

    return await this.fileProcessService.uploadFile(documentDto);
  }
}
