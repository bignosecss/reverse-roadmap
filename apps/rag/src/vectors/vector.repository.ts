import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vector } from './vector.schema';
import { Model } from 'mongoose';
import { ExtractChunkData, InsertChunkData } from './types';

@Injectable()
export class VectorRepository {
  constructor(
    @InjectModel(Vector.name) private readonly vectorModel: Model<Vector>,
  ) {}

  async insertChunk({
    fileId,
    vector,
    pageContent,
  }: InsertChunkData) {
    return await this.vectorModel.create({
      fileId,
      vector,
      pageContent,
    });
  }

  async insertChunks(chunks: InsertChunkData[]): Promise<number> {
    const insertResult = await this.vectorModel.insertMany(
      chunks.map(({ fileId, vector, pageContent }) => ({
        fileId,
        vector,
        pageContent,
      })),
    );
    return insertResult.length;
  }

  async similaritySearch(query: number[]): Promise<ExtractChunkData[]> {
    const results = await this.vectorModel.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index', // indicate the index we goin to use for our search
          path: 'vector', // indicate the field the vectors are stored
          queryVector: query,
          numCandidates: 100, // number of chunks to consider for the comparison
          limit: 5, // the number of returned results on score order from high to low
        },
      },
      {
        $project: {
          // here we define wich fields we want to return, 1 return the field and 0 to hide it
          _id: 1,
          fileId: 1,
          fileName: 1,
          pageContent: 1,
          score: {
            $meta: 'vectorSearchScore',
          },
        },
      },
    ]);

    return results as ExtractChunkData[];
  }
}
