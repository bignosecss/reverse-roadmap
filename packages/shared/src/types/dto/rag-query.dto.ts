export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface RAGQueryContext {
  /** 用户是否已登录 */
  isAuthenticated: boolean;
  /** 根目标 ID，用于限制查询范围 */
  rrRootId: string;
}

export interface RAGQueryRequest {
  /** 查询文本 */
  query: string;
  /** 查询上下文，可选 */
  context?: RAGQueryContext;
  /** 对话历史 */
  history?: ChatMessage[];
}
