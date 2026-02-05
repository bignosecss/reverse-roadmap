import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { OllamaEmbeddings } from '@langchain/ollama';
import {
  DistanceStrategy,
  PGVectorStore,
} from '@langchain/community/vectorstores/pgvector';
import * as pg from 'pg';

@Injectable()
export class VectorStoreService
  extends PGVectorStore
  implements OnModuleInit, OnModuleDestroy
{
  private poolClient!: pg.Pool;

  // Override constructor to accept no args (NestJS requirement)
  constructor() {
    // Pass temporary values, will be properly initialized in onModuleInit
    super(
      new OllamaEmbeddings({
        model: 'nomic-embed-text',
        baseUrl: 'http://ollama:11434',
      }),
      {
        pool: new pg.Pool(),
        tableName: '',
        columns: {
          idColumnName: '',
          vectorColumnName: '',
          contentColumnName: '',
          metadataColumnName: '',
        },
        distanceStrategy: 'cosine',
      },
    );
  }

  async onModuleInit() {
    const { postgresConnectionOptions, tableName, columns, distanceStrategy } =
      config;
    this.poolClient = new pg.Pool(postgresConnectionOptions);
    await this.ensureDatabaseSchema();

    // Reinitialize the PGVectorStore with proper config
    const pgVectorStore = await PGVectorStore.initialize(
      new OllamaEmbeddings({
        model: 'nomic-embed-text',
        baseUrl: 'http://ollama:11434',
      }),
      {
        pool: this.poolClient,
        tableName,
        columns,
        distanceStrategy,
      },
    );
    // Copy all properties from the properly initialized instance
    Object.assign(this, pgVectorStore);
  }

  private async ensureDatabaseSchema() {
    const client = await this.poolClient.connect();
    try {
      const query = `
      CREATE TABLE IF NOT EXISTS ${config.tableName} (
        ${config.columns.idColumnName} UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        ${config.columns.vectorColumnName} VECTOR,
        ${config.columns.contentColumnName} TEXT,
        ${config.columns.metadataColumnName} JSONB
      );
    `;
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await client.query('CREATE EXTENSION IF NOT EXISTS vector');
      await client.query(query);
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.poolClient.end();
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
  } as pg.PoolConfig,
  tableName: 'testlangchain',
  columns: {
    idColumnName: 'id',
    vectorColumnName: 'vector',
    contentColumnName: 'content',
    metadataColumnName: 'metadata',
  },
  distanceStrategy: 'cosine' as DistanceStrategy,
};
