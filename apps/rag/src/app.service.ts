import { Injectable, Logger } from '@nestjs/common';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { RunnablePick, RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { formatDocumentsAsString } from '@langchain/classic/util/document';
import { ChatDeepSeek } from '@langchain/deepseek';
import { LoaderService } from './loaders/loader.service';
import { VectorStoreService } from './vectors/vector-store.service';
import type { SemanticDocumentUnion, RAGQueryRequest } from '@repo/shared';
import { TEMPLATES } from './utils/template.constant';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

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
    const { query, context, history } = request;
    const filter = this.buildMetadataFilter(context);

    const historyMessages = history
      ?.map((msg) => {
        switch (msg.role) {
          case 'system':
            return new SystemMessage(msg.content);
          case 'assistant':
            return new AIMessage(msg.content);
          case 'user':
            return new HumanMessage(msg.content);
          default:
            return null;
        }
      })
      .filter(Boolean) as BaseMessage[];
    this.logger.debug(`[HISTORY] ${JSON.stringify(historyMessages, null, 2)}`);

    const systemMessages = SystemMessagePromptTemplate.fromTemplate(
      TEMPLATES.NATIVE_DOCUMENT_SYSTEM_PROMPT,
    );
    const prompt = ChatPromptTemplate.fromMessages([
      systemMessages,
      new MessagesPlaceholder('chat_history'),
    ]);

    const retriever = this.vectorStore.instance.asRetriever(999, filter);
    const model = new ChatDeepSeek({
      temperature: 0.8,
      model: 'deepseek-chat',
    });
    const ragChain = RunnableSequence.from([
      {
        around_info: new RunnablePick('around_info'),
        context: new RunnablePick('query')
          .pipe(retriever)
          .pipe(formatDocumentsAsString),
        query: new RunnablePick('query'),
        chat_history: new RunnablePick('chat_history'),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);
    const response = await ragChain.invoke({
      query,
      chat_history: historyMessages,
    });

    const retrievedDocs = await retriever.invoke(query);
    const formattedPrompt = await prompt.format({
      around_info: context?.aroundInfo,
      context: formatDocumentsAsString(retrievedDocs),
      query,
      chat_history: historyMessages,
    });
    this.logger.log(`[RAG] 最终渲染的提示词:\n${formattedPrompt}`);

    return {
      success: true,
      message: 'AI Message',
      data: response,
    };
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

    const { isAuthenticated, rrRootId } = context;

    // 基础过滤条件：仅允许查询当前 root
    const filter: Record<string, any> = { rrRootId };

    // 如果用户未登录，额外限制为 isPublic 的文档
    if (!isAuthenticated) {
      filter.isPublic = true;
    }

    return filter;
  }
}
