export interface NodeContext {
  hierarchy: string[];
  level: number;
  parentNodeTitle: string | null;
  parentNodeId: string | null;
  childrenTitles: string[];
}

export interface ContentContext {
  nodeId: string;
  nodeTitle: string;
  nodeStatus: string;
  nodeDescription?: string;
  rrRootId: string;
  rrRootTitle: string;
}
