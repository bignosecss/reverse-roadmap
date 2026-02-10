import {
  createAgent,
  createMiddleware,
  ToolMessage,
  HumanMessage,
  BaseMessage,
  AIMessage,
} from 'langchain';
import { ChatDeepSeek } from '@langchain/deepseek';
import { Injectable } from '@nestjs/common';
import { LLM_CONFIG } from 'src/utils/constants/model.constants';
import { AgentResponse, ToolCallInfo, ModelInfo } from '@repo/shared';
import { TEMPLATES } from 'src/utils/constants/template.constant';
import { getTools } from './tools';

@Injectable()
export class AgentService {
  async agent(query: string): Promise<AgentResponse> {
    const model = new ChatDeepSeek(LLM_CONFIG.DEEPSEEK);

    const agent = createAgent({
      model,
      tools: getTools(),
      middleware: [this.handleToolErrors()],
      systemPrompt: TEMPLATES.AGENT_SYSTEM_PROMPT,
    });
    const result = await agent.invoke({ messages: new HumanMessage(query) });

    return this.formatAgentResponse(result.messages as BaseMessage[]);
  }

  private formatAgentResponse(messages: BaseMessage[]): AgentResponse {
    // 获取最后一条消息（最终回复）
    const lastMessage = messages.at(-1);
    if (!lastMessage) {
      return { reply: '', model: { provider: 'unknown', name: 'unknown' } };
    }
    const reply = lastMessage.content as string;

    // 提取所有工具调用
    const toolCalls: ToolCallInfo[] = [];

    for (const message of messages) {
      if (
        AIMessage.isInstance(message) &&
        (message as AIMessage).tool_calls?.length
      ) {
        const aiMessage = message as AIMessage;
        for (const toolCall of aiMessage.tool_calls!) {
          // 找到对应的工具返回消息
          const toolMessage = messages.find(
            (m) =>
              ToolMessage.isInstance(m) &&
              (m as ToolMessage).tool_call_id === toolCall.id,
          ) as ToolMessage | undefined;

          toolCalls.push({
            name: toolCall.name,
            input: toolCall.args,
            output: (toolMessage?.content as string) || '',
          });
        }
      }
    }

    // 提取 AI 消息的元数据
    const aiMessages = messages.filter((m) =>
      AIMessage.isInstance(m),
    ) as AIMessage[];
    const lastAIMessage = aiMessages.at(-1);
    const metadata = lastAIMessage?.response_metadata;

    // 提取模型信息
    const modelInfo: ModelInfo = {
      provider: (metadata?.model_provider as string) || 'unknown',
      name: (metadata?.model_name as string) || 'unknown',
    };

    // 提取 token 使用统计
    const tokenUsage = metadata?.usage as
      | {
          prompt_tokens?: number;
          completion_tokens?: number;
          total_tokens?: number;
          prompt_cache_hit_tokens?: number;
          prompt_cache_miss_tokens?: number;
        }
      | undefined;

    return {
      reply,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: tokenUsage
        ? {
            promptTokens: tokenUsage.prompt_tokens,
            completionTokens: tokenUsage.completion_tokens,
            totalTokens: tokenUsage.total_tokens,
            promptCacheHitTokens: tokenUsage.prompt_cache_hit_tokens,
            promptCacheMissTokens: tokenUsage.prompt_cache_miss_tokens,
          }
        : undefined,
      model: modelInfo,
    };
  }

  private handleToolErrors() {
    return createMiddleware({
      name: 'HandleToolErrors',
      wrapToolCall: async (request, handler) => {
        try {
          return await handler(request);
        } catch (error) {
          // Return a custom error message to the model
          return new ToolMessage({
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            content: `Tool error: Please check your input and try again. (${error})`,
            tool_call_id: request.toolCall.id!,
          });
        }
      },
    });
  }
}
