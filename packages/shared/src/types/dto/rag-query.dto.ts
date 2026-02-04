/**
 * RAG 向量搜索的 metadata 过滤器类型
 * 兼容 LangChain PGVectorStore 的 MetadataFilter 类型
 */
export type MetadataFilter = Record<
  string,
  | string
  | number
  | boolean
  | {
      /** Match any of the provided values */
      in?: (string | number | boolean)[];
      /** Exclude any of the provided values */
      notIn?: (string | number | boolean)[];
      /** Array contains any of the provided values */
      arrayContains?: (string | number | boolean)[];
      /** Greater than (for numeric values) */
      gt?: number;
      /** Greater than or equal (for numeric values) */
      gte?: number;
      /** Less than (for numeric values) */
      lt?: number;
      /** Less than or equal (for numeric values) */
      lte?: number;
      /** Not equal to */
      neq?: string | number | boolean;
    }
>;

/**
 * RAG 查询请求的上下文信息
 * 用于控制访问权限
 */
export interface RAGQueryContext {
  /** 用户是否已登录 */
  isAuthenticated: boolean;
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
