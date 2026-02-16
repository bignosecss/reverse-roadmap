interface AgentSuccessToastProps {
  model: {
    provider: string;
    name: string;
  };
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    promptCacheHitTokens?: number;
    promptCacheMissTokens?: number;
  };
  toolCalls?: Array<{
    name: string;
  }>;
}

export function AgentSuccessToast({
  model,
  usage,
  toolCalls,
}: AgentSuccessToastProps) {
  return (
    <div className="space-y-1.5 text-sm">
      <div>
        <span className="font-semibold">模型:</span> {model.provider}/
        {model.name}
      </div>
      {usage && (
        <div>
          <span className="font-semibold">📊 Token:</span> 输入{" "}
          {usage.promptTokens ?? 0} | 输出 {usage.completionTokens ?? 0} | 总计{" "}
          {usage.totalTokens ?? 0}
        </div>
      )}
      {toolCalls && toolCalls.length > 0 && (
        <div>
          <span className="font-semibold">🔧 工具:</span>{" "}
          {toolCalls.map((t) => t.name).join(", ")}
        </div>
      )}
      {usage?.promptCacheHitTokens && (
        <div>
          <span className="font-semibold">💾 缓存:</span> 命中{" "}
          {usage.promptCacheHitTokens} | 未命中{" "}
          {usage.promptCacheMissTokens ?? 0}
        </div>
      )}
    </div>
  );
}
