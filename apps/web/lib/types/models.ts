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

/** 侧边栏数据 */
export interface RrRoot {
  _id: string;
  title: string;
  rootRrNode: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

/** 思维导图节点 */
export type NodeContent = {
  rrContent: string;
  tabTitle: string;
};
export interface RrNode {
  _id: string;
  title: string;
  description?: string;
  parent: string | null;
  content: NodeContent[];
  children: RrNode[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RrContent {
  _id: string;
  tabTitle: string;
  type: "doc";
  // 方便起见，暂时使用 any 作为 tiptap 文档的类型( edirot.getJSON() )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
  createdAt: Date;
  updatedAt: Date;
}

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
};

export type SidebarState = {
  rrRoots: RrRoot[];
  setRrRoots: (roots: RrRoot[]) => void;
};

export type CanvasState = {
  canvasOpen: boolean;
  savingContent: boolean;
  selectedRrContentTab: string;
  setCanvasOpen: (open: boolean) => void;
  setSavingContent: (saving: boolean) => void;
  setSelectedRrContentTab: (rrContent: string) => void;
};
