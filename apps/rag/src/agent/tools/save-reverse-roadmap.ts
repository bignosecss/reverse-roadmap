import * as z from 'zod';
import { tool } from 'langchain';
import { ApiNodeClient } from '../client/api-node.client';
import type { AgentRrNodeDto } from '@repo/shared';

/**
 * 保存 reverse roadmap 工具
 *
 * 这个工具接收 generate_reverse_roadmap 生成的 AgentRrNode 结构，
 * 然后调用 API 接口将数据保存到 MongoDB。
 */
export function saveReverseRoadmapTool(apiClient: ApiNodeClient) {
  return tool(
    async ({ node }: { node: AgentRrNodeDto }) => {
      try {
        const result = await apiClient.saveReverseRoadmap({ node });
        return JSON.stringify(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        return JSON.stringify({
          success: false,
          message: `Failed to save reverse roadmap: ${errorMessage}`,
        });
      }
    },
    {
      name: 'save_reverse_roadmap',
      description: `保存 Reverse Roadmap 到数据库。

这个工具接收一个 AgentRrNode 结构（由 generate_reverse_roadmap 工具生成），
然后调用 API 接口将节点树完整保存到 MongoDB。

API 端会处理所有逻辑：递归创建节点、内容、建立关联等。

使用前请确保先调用 generate_reverse_roadmap 生成结构化的节点树。`,
      schema: z.object({
        node: z
          .object({
            title: z.string(),
            description: z.string().optional(),
            parent: z.union([z.string(), z.null()]),
            content: z.array(
              z.object({
                tabTitle: z.string(),
                type: z.literal('doc'),
                content: z.array(z.any()),
              }),
            ),
            children: z.lazy(() =>
              z.array(
                z.object({
                  title: z.string(),
                  description: z.string().optional(),
                  parent: z.union([z.string(), z.null()]),
                  content: z.array(
                    z.object({
                      tabTitle: z.string(),
                      type: z.literal('doc'),
                      content: z.array(z.any()),
                    }),
                  ),
                  children: z.array(z.any()).optional(),
                  status: z.string().optional(),
                  excludeFromRAG: z.boolean().optional(),
                }),
              ),
            ),
            status: z.string().optional(),
            excludeFromRAG: z.boolean().optional(),
          })
          .describe('要保存的节点树结构（AgentRrNode）'),
      }),
    },
  );
}
