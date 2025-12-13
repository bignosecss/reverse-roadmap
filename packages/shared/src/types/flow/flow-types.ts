/**
 * React Flow Types
 */

import type { Node, Edge } from "@xyflow/react";
import type { RrNode } from "../models";

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
