export interface RrContentDocument {
  id: string;
  rrRootTitle: string; // 所属根目标标题
  nodeTitle: string; // 所属节点标题
  tabTitle: string; // tabTitle - 标签页标题
  content: string; // 纯文本内容（TipTap → Markdown）

  metadata: {
    // 内容标识
    tabTitle: string;
    contentHtml?: string; // 可选的 HTML 版本
    contentLength: number; // 内容长度

    // 节点关系
    nodeId: string;
    nodeTitle: string;
    nodeDescription?: string;
    nodeStatus: string;

    // 根目标关系
    rrRootId: string;
    rrRootTitle: string;

    // 时间信息
    createdAt: Date;
    updatedAt: Date;
  };
}
