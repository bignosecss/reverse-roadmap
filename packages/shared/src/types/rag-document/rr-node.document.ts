export interface RrNodeDocument {
  id: string;
  title: string; // 从节点层级生成语义标题
  description: string;
  parentNodeTitle: string; // 直属父节点的标题
  tabTitles: string[]; // 该节点包含的 NodeContent title
  childrenTitles: string[]; // 子节点的标题

  metadata: {
    // 层级信息
    hierarchy: string[]; // ["终极目标", "阶段1", "子任务1"]
    level: number; // 0=根, 1=第一层...

    // 节点属性
    nodeTitle: string; // RrNode.title
    nodeDescription?: string; // RrNode.description
    nodeStatus: string; // RrNode.status

    // 内容属性
    tabTitles: string[]; // 所有标签页名称

    // 时间信息
    createdAt: Date;
    updatedAt: Date;

    // 关联信息
    rrRootId: string; // 所属 RrRoot
    rrRootTitle: string; // 根目标标题
    parentNodeId: string | null;
    parentNodeTitle: string | null;
    childrenCount: number; // 子节点数量
    childrenTitles: string[];
  };
}
