/** 工具调用信息 */
export interface ToolCallInfo {
  /** 工具名称 */
  name: string;
  /** 工具输入参数 */
  input: Record<string, unknown>;
  /** 工具返回结果 */
  output: string;
}

/** Token 使用统计 */
export interface TokenUsage {
  /** 输入 token 数 */
  promptTokens?: number;
  /** 输出 token 数 */
  completionTokens?: number;
  /** 总 token 数 */
  totalTokens?: number;
  /** 缓存命中的 token 数 */
  promptCacheHitTokens?: number;
  /** 缓存未命中的 token 数 */
  promptCacheMissTokens?: number;
}

/** 模型信息 */
export interface ModelInfo {
  /** 模型提供商 */
  provider: string;
  /** 模型名称 */
  name: string;
}

/** Agent 响应 */
export interface AgentResponse {
  /** 最终回复内容 */
  reply: string;
  /** 工具调用记录（可选） */
  toolCalls?: ToolCallInfo[];
  /** Token 使用统计（可选） */
  usage?: TokenUsage;
  /** 模型信息 */
  model: ModelInfo;
}
