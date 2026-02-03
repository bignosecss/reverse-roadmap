import { OllamaEmbeddings } from '@langchain/ollama';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private model: OllamaEmbeddings;

  constructor() {
    this.model = new OllamaEmbeddings({
      model: 'nomic-embed-text',
      baseUrl: 'http://ollama:11434',
    });
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return this.model.embedDocuments(texts);
  }

  async embedQuery(text: string): Promise<number[]> {
    return this.model.embedQuery(text);
  }
}
