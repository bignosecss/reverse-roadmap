import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { formatDocumentsAsString } from '@langchain/classic/util/document';
import { ChatDeepSeek } from '@langchain/deepseek';
import { LoaderService } from './loaders/loader.service';
import { VectorStoreService } from './vectors/vector-store.service';
import type { SemanticDocumentUnion, RAGQueryRequest } from '@repo/shared';
import { TEMPLATES } from './utils/template.constant';

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
    await this.vectorStore.instance.addDocuments(documents);
  }

  /**
   * 根据查询请求生成增强回复
   */
  async AugmentedReply(request: RAGQueryRequest) {
    const { query, context } = request;

    // 构建基于上下文的过滤条件
    const filter = this.buildMetadataFilter(context);

    const prompt = ChatPromptTemplate.fromTemplate(
      TEMPLATES.NATIVE_DOCUMENT_CONTEXT_CHAT,
    );
    const retriever = this.vectorStore.instance.asRetriever(3, filter);
    const model = new ChatDeepSeek({
      temperature: 0.8,
      model: 'deepseek-chat',
    });
    const ragChain = RunnableSequence.from([
      // 这一步是关键：并行处理 context 和 question
      {
        // 自动将检索到的 Docs 转为字符串
        context: retriever.pipe(formatDocumentsAsString),
        query: new RunnablePassthrough(), // 保持原始 query 不变
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);
    const response = await ragChain.invoke(query);

    return response;
  }

  /**
   * 根据上下文构建 metadata 过滤条件
   */
  private buildMetadataFilter(
    context?: RAGQueryRequest['context'],
  ): Record<string, any> | undefined {
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
