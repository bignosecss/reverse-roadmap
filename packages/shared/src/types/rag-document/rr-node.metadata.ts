/**
 * 节点元数据
 * 由 RrNodeDocument 和 SemanticNodeDocument 共享
 */
export interface RrNodeMetadata {
  // 节点标识
  nodeId: string;
  nodeTitle: string;
  nodeDescription?: string;
  nodeStatus: string;

  // 所属目标
  rrRootId: string;
  rrRootTitle: string;

  // 层级信息
  hierarchy: string[];
  level: number;

  // 父节点信息
  parentNodeId: string | null;
  parentNodeTitle: string | null;

  // 子节点信息
  childrenCount: number;
  childrenTitles: string[];

  // 内容标签页
  tabTitles: string[];

  // 时间信息
  createdAt: Date;
  updatedAt: Date;
}
