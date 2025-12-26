import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileProcessStrategy } from '../file-process-strategy.interface';
import { Document } from 'langchain';
import { TextLoader } from '@langchain/classic/document_loaders/fs/text';
import { MarkdownTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class MDProcessStrategy implements FileProcessStrategy {
  async parse(filePath: string): Promise<Document<Record<string, any>>[]> {
    try {
      // Validate file path
      if (!filePath) {
        throw new BadRequestException('File path is required for JSON parsing');
      }

      const loader = new TextLoader(filePath);
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
      const textSplitter = new MarkdownTextSplitter({
        chunkSize: 1200,
        chunkOverlap: 200,
        // 保留标题与内容的关联
        keepSeparator: true,
      });

      const mdChunks = await textSplitter.splitDocuments(docs);

      const enhancedChunks = mdChunks.map((chunk) => {
        // 提取当前chunk中的最高级别标题
        const titleMatch = chunk.pageContent.match(/^#{1,4} (.*)$/m);
        return {
          ...chunk,
          metadata: {
            ...chunk.metadata,
            section_title: titleMatch ? titleMatch[1] : '',
          },
        };
      });

      return enhancedChunks;
    } catch (e: unknown) {
      throw new InternalServerErrorException(
        `Failed to chunk JSON documents: ${e instanceof Error ? e.message : 'Unknown error occurred'}`,
      );
    }
  }
}
