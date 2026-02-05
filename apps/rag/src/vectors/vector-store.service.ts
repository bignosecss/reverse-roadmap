import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { OllamaEmbeddings } from '@langchain/ollama';
import {
  DistanceStrategy,
  PGVectorStore,
} from '@langchain/community/vectorstores/pgvector';
import * as pg from 'pg';
import { ConfigService } from '@nestjs/config';

interface PGVectorConfig {
  poolConfig: pg.PoolConfig;
  tableName: string;
  columns: {
    idColumnName: string;
    vectorColumnName: string;
    contentColumnName: string;
    metadataColumnName: string;
  };
  distanceStrategy: DistanceStrategy;
  vectorDimension: number;
}

@Injectable()
export class VectorStoreService implements OnModuleInit, OnModuleDestroy {
  private vectorStore!: PGVectorStore;
  private pool!: pg.Pool;
  private readonly logger = new Logger(VectorStoreService.name);
  private readonly config: PGVectorConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      poolConfig: {
        host: this.configService.get('PGVECTOR_HOST', 'pgvector'),
        port: this.configService.get('PGVECTOR_PORT', 5432),
        user: this.configService.get('PGVECTOR_USER', 'pgvector'),
        password: this.configService.get('PGVECTOR_PASSWORD', 'admin'),
        database: this.configService.get('PGVECTOR_DB', 'pgvector-db'),
      },
      tableName: this.configService.get('PGVECTOR_TABLE', 'testlangchain'),
      columns: {
        idColumnName: 'id',
        vectorColumnName: 'vector',
        contentColumnName: 'content',
        metadataColumnName: 'metadata',
      },
      distanceStrategy: this.configService.get<DistanceStrategy>(
        'PGVECTOR_DISTANCE',
        'cosine',
      ),
      vectorDimension: 768,
    };
  }

  async onModuleInit() {
    try {
      this.pool = new pg.Pool(this.config.poolConfig);
      await this.pool.query('SELECT 1');
      this.logger.log('PGVector connection pool initialized successfully');

      await this.ensureDatabaseSchema();

      this.vectorStore = await PGVectorStore.initialize(
        new OllamaEmbeddings({
          model: 'nomic-embed-text',
          baseUrl: this.configService.get(
            'OLLAMA_BASE_URL',
            'http://ollama:11434',
          ),
        }),
        {
          pool: this.pool,
          tableName: this.config.tableName,
          columns: this.config.columns,
          distanceStrategy: this.config.distanceStrategy,
        },
      );
      this.logger.log('PGVectorStore initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize VectorStoreService', error);
      throw new Error('Vector store initialization failed');
    }
  }

  private async ensureDatabaseSchema() {
    let client: pg.PoolClient | null = null;
    try {
      client = await this.pool.connect();

      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await client.query('CREATE EXTENSION IF NOT EXISTS vector');

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${this.config.tableName} (
          ${this.config.columns.idColumnName} UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          ${this.config.columns.vectorColumnName} VECTOR(${this.config.vectorDimension}),
          ${this.config.columns.contentColumnName} TEXT NOT NULL,
          ${this.config.columns.metadataColumnName} JSONB
        );
      `;

      await client.query(createTableQuery);
      this.logger.log(
        `PGVector table ${this.config.tableName} ensured with schema`,
      );
    } catch (error) {
      this.logger.error('Failed to ensure database schema', error);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      try {
        await this.pool.end();
        this.logger.log('PGVector connection pool closed successfully');
      } catch (error) {
        this.logger.error('Failed to close connection pool', error);
      }
    }
  }

  get instance(): PGVectorStore {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }
    return this.vectorStore;
  }
}
