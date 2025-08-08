/**
 * UI 状态类型定义
 */

import type { ObjectId, AsyncState } from "./base";
import type { RrRoot, RrTree } from "./models";

/** 侧边栏状态 */
export interface SidebarState {
  isOpen: boolean;
  selectedRootId: ObjectId | null;
  roots: AsyncState<RrRoot[]>;
}

/** 树视图状态 */
export interface TreeViewState {
  expandedNodes: Set<ObjectId>;
  selectedNodeId: ObjectId | null;
  tree: AsyncState<RrTree>;
  viewMode: "tree" | "list";
}
