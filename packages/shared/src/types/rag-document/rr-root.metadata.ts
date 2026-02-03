import { RrRootStatus } from "../models";

/**
 * 根目标元数据
 * 由 RrRootDocument 和 SemanticRootDocument 共享
 */
export interface RrRootMetadata {
  // 原始数据标识
  rrRootId: string;
  rrRootTitle: string;

  // 根节点信息
  rootRrNodeId: string;
  rootRrNodeTitle: string;
  rootRrNodeDescription?: string;
  rootRrNodeStatus: string;

  // 根目标属性
  rootStatus: RrRootStatus;

  // 层级结构信息
  totalNodes: number;
  totalTabs: number;

  // 进度统计
  completedNodesCount: number;
  deprecatedNodesCount: number;
  inProgressNodesCount: number;
  notStartedNodesCount: number;
  blockedNodesCount: number;
  reviewNodesCount: number;
  cancelledNodesCount: number;
  activeNodesCount: number;

  // 时间信息
  createdAt: Date;
  updatedAt: Date;
}
