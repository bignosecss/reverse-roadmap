/**
 * 数据模型类型定义
 */

import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "@xyflow/react";
import { RrNode } from "@repo/shared/models";
import { RrRootStatus } from "@repo/shared/models";

export type FlowNode = Node<
  {
    label: string;
    rrNode: RrNode;
  },
  "rrNode"
>;

export type FlowEdge = Edge;

// 转换结果类型
export type FlowData = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export type FlowState = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  currentRrNode: RrNode | null;
  onNodesChange: OnNodesChange<FlowNode>;
  onEdgesChange: OnEdgesChange<FlowEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  setCurrentRrNode: (node: RrNode) => void;
  getNode: (rrNodeId: string) => FlowNode | undefined;
};

export type SidebarState = {
  mode: RrRootStatus;
  toggleMode: (m: RrRootStatus) => void;
};

export type CanvasState = {
  canvasOpen: boolean;
  savingContent: boolean;
  selectedRrContentTab: string;
  setCanvasOpen: (open: boolean) => void;
  setSavingContent: (saving: boolean) => void;
  setSelectedRrContentTab: (rrContentTab: string) => void;
};
