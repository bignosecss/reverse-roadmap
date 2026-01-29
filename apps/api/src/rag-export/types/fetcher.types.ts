import type { RrRoot, RrNode, RrContent } from '@repo/shared';

export interface FetchedData {
  root: RrRoot & { rootRrNodeEntity: RrNode };
  nodes: RrNode[];
  contents: RrContent[];
}
