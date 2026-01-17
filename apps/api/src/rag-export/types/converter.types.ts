export type ContentType = 'goal' | 'task' | 'note' | 'code';

export interface ConversionResult {
  markdown: string;
  tags: string[];
  contentType: ContentType;
  contentLength: number;
}

export interface StatusCounts {
  completed: number;
  deprecated: number;
  inProgress: number;
  notStarted: number;
  blocked: number;
  review: number;
  cancelled: number;
  active: number;
}
