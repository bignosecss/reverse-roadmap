export interface InsertChunkData {
  fileId: string;
  vector: number[];
  pageContent: string;
}

export type ExtractChunkData = {
  _id: string;
  score: number;
  fileId: string;
  fileName: string;
  pageContent: string;
};
