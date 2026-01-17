import type { RrRoot, RrNode, RrContent } from '@repo/shared';

export interface FetchedData {
  root: RrRoot & { rootRrNode: RrNode };
  nodes: RrNode[];
  contents: RrContent[];
}
