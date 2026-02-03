import { Injectable, Logger } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';
import type {
  SemanticDocumentUnion,
  SemanticRootDocument,
  SemanticNodeDocument,
} from '@repo/shared';

@Injectable()
export class LoaderService {
  private readonly logger = new Logger(LoaderService.name);

  private textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ['\n\n', '\n', '。', '，', ' ', ''],
  });

  /**
   * 处理语义化文档，根据类型选择不同的加载策略
   */
  async loadDocuments(docs: SemanticDocumentUnion[]): Promise<Document[]> {
    const documents: Document[] = [];

    for (const doc of docs) {
      if (doc.type === 'root' || doc.type === 'node') {
        const loaded = await this.loadStructuredDocument(doc);
        documents.push(...loaded);
      } else if (doc.type === 'content') {
        // TODO: 实现 content 文档的加载策略
        this.logger.warn(
          `Content document loader not implemented yet: ${doc.id}`,
        );
      }
    }

    this.logger.log(`Loaded ${documents.length} document chunks`);
    return documents;
  }

  /**
   * 加载结构化文档（root 或 node）
   * 将结构化文本分割成小块，便于向量检索
   */
  private async loadStructuredDocument(
    doc: SemanticRootDocument | SemanticNodeDocument,
  ): Promise<Document[]> {
    const chunks = await this.textSplitter.splitText(doc.content);

    return chunks.map((chunk, index) => ({
      pageContent: chunk,
      metadata: {
        ...doc.metadata,
        docType: doc.type,
        docId: doc.id,
        chunkIndex: index,
        totalChunks: chunks.length,
      },
    }));
  }
}
