import type { RrNodeMetadata } from "./rr-node.metadata";

export interface RrNodeDocument {
  id: string;
  title: string; // 从节点层级生成语义标题
  description: string;
  parentNodeTitle: string; // 直属父节点的标题
  tabTitles: string[]; // 该节点包含的 NodeContent title
  childrenTitles: string[]; // 子节点的标题
  metadata: RrNodeMetadata;
}
