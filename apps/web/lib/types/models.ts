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
  treeRootNodeId: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

/** 思维导图节点 */
export interface RrNode {
  _id: string;
  title: string;
  description?: string;
  parentId: string | null;
  children: RrNode[];
  createdAt?: Date;
  updatedAt?: Date;
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
  onNodesChange: OnNodesChange<FlowNode>;
  onEdgesChange: OnEdgesChange<FlowEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
};
