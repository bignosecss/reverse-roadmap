/**
 * RAG 查询请求的上下文信息
 * 用于控制访问权限
 */
export interface RAGQueryContext {
  /** 用户是否已登录 */
  isAuthenticated: boolean;
  /** 根目标 ID，用于限制查询范围 */
  rrRootId: string;
}

/**
 * RAG 查询请求 DTO
 */
export interface RAGQueryRequest {
  /** 查询文本 */
  query: string;
  /** 查询上下文，可选 */
  context?: RAGQueryContext;
}
