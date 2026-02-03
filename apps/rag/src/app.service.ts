import { Injectable } from '@nestjs/common';
import { LoaderService } from './loaders/loader.service';
import { VectorStoreService } from './vectors/vector-store.service';
import { SemanticDocumentUnion } from '@repo/shared';

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

  async getText(query: string) {
    return await this.vectorStore.similaritySearch(query, 3);
  }
}
