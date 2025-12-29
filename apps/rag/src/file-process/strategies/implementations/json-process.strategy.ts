import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileProcessStrategy } from '../file-process-strategy.interface';
import { Document } from 'langchain';
import { JSONLoader } from '@langchain/classic/document_loaders/fs/json';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class JSONProcessStrategy implements FileProcessStrategy {
  async parse(filePath: string): Promise<Document<Record<string, any>>[]> {
    try {
      // Validate file path
      if (!filePath) {
        throw new BadRequestException('File path is required for JSON parsing');
      }

      const loader = new JSONLoader(filePath);
      const docs = await loader.load();

      return docs;
    } catch (e: unknown) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException(
        `Failed to parse JSON file: ${e instanceof Error ? e.message : 'Unknown error occurred'}`,
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

      // Split the JSON into texts using RecursiveCharacterTextSplitter
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 150,
        // JSON文本通常句子结构紧凑，优先按句子分割
        separators: ['. ', '? ', '! ', '\n', ' ', ''],
      });

      // TODO: 优化重复分割的逻辑
      const jsonChunks = await textSplitter.splitDocuments(docs);

      let embeddings: Document[] = [];
      for (let index = 0; index < jsonChunks.length; index++) {
        const page = jsonChunks[index];
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
        `Failed to chunk JSON documents: ${e instanceof Error ? e.message : 'Unknown error occurred'}`,
      );
    }
  }
}
