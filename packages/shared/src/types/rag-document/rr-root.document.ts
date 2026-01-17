export interface RrRootDocument {
  id: string;
  title: string;
  rootRrNodeTitle: string;

  metadata: {
    // 根节点信息
    rootRrNodeId: string;
    rootRrNodeTitle: string;
    rootRrNodeDescription: string;
    rootRrNodeStatus: string;

    // 根目标属性
    rootStatus: string; // "public" | "private"

    // 层级结构信息
    totalNodes: number; // 节点总数
    totalTabs: number; // 内容标签页总数

    // 进度统计
    completedNodesCount: number;
    deprecatedNodesCount: number;
    inProgressNodesCount: number;
    notStartedNodesCount: number;
    blockedNodesCount: number;
    reviwNodesCount: number;
    cancelledNodesCount: number;
    activeNodesCount: number;

    // 时间信息
    createdAt: Date;
    updatedAt: Date;
  };
}
