import type { RrRootMetadata } from "./rr-root.metadata";

export interface RrRootDocument {
  id: string;
  title: string;
  rootRrNodeTitle: string;
  metadata: RrRootMetadata;
}
