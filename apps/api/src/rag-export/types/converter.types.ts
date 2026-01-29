export interface ConversionResult {
  markdown: string;
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
