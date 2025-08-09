/**
 * 数据模型类型定义
 */

import type { ObjectId } from "./common";

/** 侧边栏数据 */
export interface RrRoot {
  _id: ObjectId;
  title: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

/** 思维导图节点 */
export interface RrNode {
  _id: ObjectId;
  title: string;
  description?: string;
  parentId: ObjectId | null;
  children: RrNode[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/** 思维导图树结构 */
export interface RrTree {
  _id: ObjectId;
  rootId: ObjectId;
  rootNode: RrNode;
}

export interface FlowNode {
  id: string;
  type?: "rrNode";
  position: { x: number; y: number };
  data: {
    label: string;
    rrNode: RrNode;
    level: number;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: "smoothstep" | "straight" | "step";
}

// 转换结果类型
export interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}
