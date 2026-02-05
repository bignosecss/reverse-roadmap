import { Injectable, Logger } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';
import type {
  SemanticDocumentUnion,
  SemanticRootDocument,
  SemanticNodeDocument,
  SemanticContentDocument,
} from '@repo/shared';

@Injectable()
export class LoaderService {
  private readonly logger = new Logger(LoaderService.name);

  /**
   * 处理语义化文档，根据类型选择不同的加载策略
   */
  async loadDocuments(docs: SemanticDocumentUnion[]): Promise<Document[]> {
    const documents: Document[] = [];

    for (const doc of docs) {
      if (doc.type === 'root' || doc.type === 'node') {
        const loaded = this.loadStructuredDocument(doc);
        documents.push(...loaded);
      } else if (doc.type === 'content') {
        const loaded = await this.loadContentDocument(doc);
        documents.push(...loaded);
      }
    }

    this.logger.log(`Loaded ${documents.length} document chunks`);
    return documents;
  }

  /**
   * 加载结构化文档（root 或 node）
   * root & node 的语义化文档较简单，直接作为整体迁入，无需 chunk 策略
   */
  private loadStructuredDocument(
    doc: SemanticRootDocument | SemanticNodeDocument,
  ): Document[] {
    return [
      {
        pageContent: doc.content,
        metadata: {
          ...doc.metadata,
          docType: doc.type,
          docId: doc.id,
          chunkIndex: 0,
          totalChunks: 1,
        },
      },
    ];
  }

  /**
   * 加载内容文档（content）
   * content 字段是纯 markdown 内容，使用 markdown 优化的切分策略
   */
  private async loadContentDocument(
    doc: SemanticContentDocument,
  ): Promise<Document[]> {
    // 使用 markdown 优化的分隔符
    const markdownSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: [
        '\n## ', // 二级标题
        '\n### ', // 三级标题
        '\n#### ', // 四级标题
        '\n##### ', // 五级标题
        '\n###### ', // 六级标题
        '\n\n', // 空行
        '\n', // 换行
        '. ', // 英文句号+空格
        '。', // 中文句号
        '? ', // 问号+空格
        '？', // 中文问号
        '! ', // 感叹号+空格
        '！', // 中文感叹号
        ', ', // 逗号+空格
        '，', // 中文逗号
        ' ', // 空格
        '',
      ],
    });

    const chunks = await markdownSplitter.splitText(doc.content);

    return chunks.map((chunk, index) => ({
      pageContent: chunk,
      metadata: {
        ...doc.metadata,
        docType: 'content',
        docId: doc.id,
        chunkIndex: index,
        totalChunks: chunks.length,
      },
    }));
  }
}
