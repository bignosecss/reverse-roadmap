export interface AgentQueryContext {
  /** 节点 ID */
  rrNodeId: string;
  /** 目标 */
  title: string;
  /** 节点描述 */
  description: string;
}

export interface AgentQueryRequest {
  /** 查询文本 */
  query: string;
  /** 查询上下文，可选 */
  context: AgentQueryContext;
}
