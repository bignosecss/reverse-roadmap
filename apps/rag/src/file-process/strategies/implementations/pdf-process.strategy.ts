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
  async parse(filePath: string) {
    try {
      // Validate file path
      if (!filePath) {
        throw new BadRequestException('File path is required for PDF parsing');
      }

      const loader = new PDFLoader(filePath);
      const docs = await loader.load();

      return docs;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException(
        `Failed to parse PDF file: ${e instanceof Error ? e.message : 'Unknown error occurred'}`,
      );
    }
  }

  async chunk(docs: Document<Record<string, any>>[]) {
    try {
      if (!docs || docs.length === 0) {
        return [];
      }

      // Split the PDF into texts using RecursiveCharacterTextSplitter
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 50,
      });

      const texts = await textSplitter.splitDocuments(docs);

      let embeddings: Document[] = [];
      for (let index = 0; index < texts.length; index++) {
        const page = texts[index];
        if (!page || !page.pageContent) {
          continue;
        }

        const splitTexts = await textSplitter.splitText(page.pageContent);
        const pageEmbeddings = splitTexts.map((text) => ({
          pageContent: text,
          metadata: {
            pageNumber: index,
          },
        }));
        embeddings = embeddings.concat(pageEmbeddings);
      }

      return embeddings;
    } catch (e: unknown) {
      throw new InternalServerErrorException(
        `Failed to chunk PDF documents: ${e instanceof Error ? e.message : 'Unknown error occurred'}`,
      );
    }
  }
}
