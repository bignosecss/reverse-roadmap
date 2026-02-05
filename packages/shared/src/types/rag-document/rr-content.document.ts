import type { RrContentMetadata } from "./rr-content.metadata";

export interface RrContentDocument {
  id: string;
  rrRootTitle: string; // 所属根目标标题
  nodeTitle: string; // 所属节点标题
  tabTitle: string; // tabTitle - 标签页标题
  content: string; // 纯文本内容（TipTap → Markdown）
  metadata: RrContentMetadata;
}
