import * as z from 'zod';
import {
  createAgent,
  tool,
  createMiddleware,
  ToolMessage,
  HumanMessage,
} from 'langchain';
import { ChatDeepSeek } from '@langchain/deepseek';
import { Injectable } from '@nestjs/common';
import { LLM_CONFIG } from 'src/utils/constants/model.constants';

@Injectable()
export class AgentService {
  async agent(query: string) {
    const model = new ChatDeepSeek(LLM_CONFIG.DEEPSEEK);

    const agent = createAgent({
      model,
      tools: this.getTools(),
      middleware: [this.handleToolErrors()],
      systemPrompt: this.getSystemPrompt(),
    });
    const result = await agent.invoke({ messages: new HumanMessage(query) });
    return result;
  }

  private getSystemPrompt() {
    return `你是一个智能助手，可以帮助用户完成各种任务。

## 你的能力
- 使用 search 工具搜索信息
- 使用 get_weather 工具获取天气信息

## 使用工具的准则
1. 在使用任何工具前，先从用户的请求中提取必要的参数
2. 如果用户提供的参数不完整或不明确，主动询问用户
3. 工具调用失败时，根据错误信息给出友好的反馈并建议用户如何改进
4. 不要编造工具返回的结果，始终基于实际返回的信息回答用户
5. 合理组合使用多个工具来满足复杂的需求

## 回答风格
- 回答简洁明了，避免冗余
- 保持专业和友好的语气
- 如果无法确定答案，诚实地说明而不是猜测`;
  }

  private getTools() {
    const search = tool(({ query }) => `Results for: ${query}`, {
      name: 'search',
      description: 'Search for information',
      schema: z.object({
        query: z.string().describe('The query to search for'),
      }),
    });

    const getWeather = tool(
      ({ location }) => `Weather in ${location}: Sunny, 72°F`,
      {
        name: 'get_weather',
        description: 'Get weather information for a location',
        schema: z.object({
          location: z.string().describe('The location to get weather for'),
        }),
      },
    );

    return [search, getWeather];
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
