import { Injectable } from '@nestjs/common';
import { OllamaEmbeddings } from '@langchain/ollama';
import {
  DistanceStrategy,
  PGVectorStore,
} from '@langchain/community/vectorstores/pgvector';
import * as pg from 'pg';
import { Document } from '@langchain/core/documents';
import { PoolConfig } from 'pg';

@Injectable()
export class VectorStoreService {
  private pgvectorStore!: PGVectorStore;
  private pool!: pg.Pool;

  async onModuleInit() {
    const { postgresConnectionOptions, tableName, columns, distanceStrategy } =
      config;
    this.pool = new pg.Pool(postgresConnectionOptions);
    await this.ensureDatabaseSchema();

    const pgVectorConfig = {
      pool: this.pool,
      tableName,
      columns,
      distanceStrategy,
    };

    this.pgvectorStore = new PGVectorStore(
      new OllamaEmbeddings({
        model: 'nomic-embed-text',
        baseUrl: 'http://ollama:11434',
      }),
      pgVectorConfig,
    );
  }

  private async ensureDatabaseSchema() {
    const client = await this.pool.connect();
    try {
      // Check and create table and columns
      const query = `
      CREATE TABLE IF NOT EXISTS ${config.tableName} (
        ${config.columns.idColumnName} UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        ${config.columns.vectorColumnName} VECTOR,
        ${config.columns.contentColumnName} TEXT,
        ${config.columns.metadataColumnName} JSONB
      );
    `;
      // Create requried extensions first
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await client.query('CREATE EXTENSION IF NOT EXISTS vector');
      await client.query(query);
    } finally {
      client.release();
    }
  }

  async addDocuments(documents: Document[]): Promise<void> {
    await this.pgvectorStore.addDocuments(documents);
  }

  async similaritySearch(query: string, limit: number): Promise<Document[]> {
    return this.pgvectorStore.similaritySearch(query, limit);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}

// Define the config
const config = {
  postgresConnectionOptions: {
    type: 'postgres',
    host: 'pgvector',
    port: 5432,
    user: 'pgvector',
    password: 'admin',
    database: 'pgvector-db',
  } as PoolConfig,
  tableName: 'testlangchain',
  columns: {
    idColumnName: 'id',
    vectorColumnName: 'vector',
    contentColumnName: 'content',
    metadataColumnName: 'metadata',
  },
  distanceStrategy: 'cosine' as DistanceStrategy,
};
