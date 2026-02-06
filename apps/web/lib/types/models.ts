/**
 * 数据模型类型定义
 */

import type { OnNodesChange, OnEdgesChange, OnConnect } from "@xyflow/react";
import { RrNode } from "@repo/shared/models";
import { FlowNode, FlowEdge, FlowData } from "@repo/shared/flow";
import { UpdateRrNodeDto, UserDto } from "@repo/shared/dto";

export type FlowState = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  currentRrNode: RrNode | null;
  deletingFlowData: FlowData | null;
  onNodesChange: OnNodesChange<FlowNode>;
  onEdgesChange: OnEdgesChange<FlowEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  setCurrentRrNode: (node: RrNode) => void;
  getNode: (rrNodeId: string) => FlowNode | undefined;
  updateNode: (rrNodeId: string, updateRrNodeDto: UpdateRrNodeDto) => void;
  setDeletingFlowData: (flowData: FlowData | null) => void;
};

export type CanvasState = {
  canvasOpen: boolean;
  savingContent: boolean;
  selectedRrContentTab: string;
  setCanvasOpen: (open: boolean) => void;
  setSavingContent: (saving: boolean) => void;
  setSelectedRrContentTab: (rrContentTab: string) => void;
};

export interface AuthState {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  clearUser: () => void;
}

export interface ChatState {
  chatOpen: boolean;
  chatPosition: { x: number; y: number };
  toggleChat: (open: boolean, position?: { x: number; y: number }) => void;
}
