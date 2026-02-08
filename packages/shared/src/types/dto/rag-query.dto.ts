export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface RAGQueryContext {
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 根目标 ID，用于限制查询范围 */
  rrRootId: string;
  /** 当前所在上下文信息，转换成纯文本作为 Augmented Prompt 的一部分 */
  aroundInfo: string;
}

export interface RAGQueryRequest {
  /** 查询文本 */
  query: string;
  /** 查询上下文，可选 */
  context?: RAGQueryContext;
  /** 对话历史 */
  history?: ChatMessage[];
}
