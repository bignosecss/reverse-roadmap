/**
 * 内容元数据
 * 由 RrContentDocument 和 SemanticContentDocument 共享
 */
export interface RrContentMetadata {
  // 内容标识
  contentId: string;
  tabTitle: string;
  contentLength: number;

  // 所属节点
  nodeId: string;
  nodeTitle: string;
  nodeDescription?: string;
  nodeStatus: string;

  // 所属目标
  rrRootId: string;
  rrRootTitle: string;

  // 时间信息
  createdAt: Date;
  updatedAt: Date;
}
