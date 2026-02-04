import { Injectable } from '@nestjs/common';
import { LoaderService } from './loaders/loader.service';
import { VectorStoreService } from './vectors/vector-store.service';
import type {
  SemanticDocumentUnion,
  RAGQueryRequest,
  MetadataFilter,
} from '@repo/shared';

@Injectable()
export class AppService {
  constructor(
    private readonly loader: LoaderService,
    private readonly vectorStore: VectorStoreService,
  ) {}

  /**
   * 添加语义化文档到向量数据库
   */
  async addSemanticDocuments(docs: SemanticDocumentUnion[]) {
    const documents = await this.loader.loadDocuments(docs);
    await this.vectorStore.addDocuments(documents);
  }

  /**
   * 根据查询请求生成增强回复
   */
  async AugmentedReply(request: RAGQueryRequest) {
    const { query, context } = request;

    // 构建基于上下文的过滤条件
    const filter = this.buildMetadataFilter(context);

    const semanticSearchDocuments = await this.vectorStore.similaritySearch(
      query,
      3,
      filter,
    );

    return semanticSearchDocuments;
  }

  /**
   * 根据上下文构建 metadata 过滤条件
   */
  private buildMetadataFilter(
    context?: RAGQueryRequest['context'],
  ): MetadataFilter | undefined {
    if (!context) {
      return undefined;
    }

    const { isAuthenticated } = context;

    // 如果用户已登录，没有过滤条件
    if (isAuthenticated) {
      return undefined;
    }

    // 如果用户未登录，仅允许查找 isPublic 的文档
    return { isPublic: true };
  }
}
