import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Document } from 'langchain';
import { FileProcessStrategy } from '../file-process-strategy.interface';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class PDFProcessStrategy implements FileProcessStrategy {
  async parse(filePath: string): Promise<Document<Record<string, any>>[]> {
    try {
      // Validate file path
      if (!filePath) {
        throw new BadRequestException('File path is required for PDF parsing');
      }

      const loader = new PDFLoader(filePath);
      const docs = await loader.load();
      const cleanedDocs = docs.map((doc) => ({
        ...doc,
        pageContent: this.cleanPdfText(doc.pageContent),
      }));

      return cleanedDocs;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException(
        `Failed to parse PDF file: ${e instanceof Error ? e.message : 'Unknown error occurred'}`,
      );
    }
  }

  async chunk(
    docs: Document<Record<string, any>>[],
  ): Promise<Document<Record<string, any>>[]> {
    try {
      if (!docs || docs.length === 0) {
        return [];
      }

      // Split the PDF into texts using RecursiveCharacterTextSplitter
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        separators: [
          '\n\n', // 优先按段落分割
          '\n', // 其次按换行
          '. ', // 句子结束
          '? ',
          '! ',
          ' ',
          '',
        ],
      });

      const pdfChunks = await textSplitter.splitDocuments(docs);
      return pdfChunks;
    } catch (e: unknown) {
      throw new InternalServerErrorException(
        `Failed to chunk PDF documents: ${e instanceof Error ? e.message : 'Unknown error occurred'}`,
      );
    }
  }

  private cleanPdfText(text: string) {
    return text
      .replace(/Page \d+ of \d+/g, '') // 移除页码
      .replace(/\n{3,}/g, '\n\n') // 合并多余空行
      .replace(/[^\S\n]+/g, ' '); // 统一空白字符
  }
}
