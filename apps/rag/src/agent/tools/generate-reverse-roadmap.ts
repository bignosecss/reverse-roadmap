import * as z from 'zod';
import { tool } from 'langchain';
import type { GenerateReverseRoadmapInput } from '@repo/shared';

/**
 * 生成 reverse roadmap 工具
 *
 * 这个工具让 agent 根据用户输入的目标，生成一个完整的 AgentRrNode 结构。
 * 这个结构包含节点及其所有子节点和内容的递归定义。
 */
export function generateReverseRoadmapTool(rrRootNodeId?: string) {
  const description = `根据用户的目标，生成一个 Reverse Roadmap（倒推路线图）结构。

这个工具会将一个大目标分解为 3-5 个具体的、可执行的子目标，并为每个子节点创建详细的节点。

生成的结构是一个递归的节点树，每个节点包含：
- title: 节点标题
- description: 节点描述
- parent: 父节点 ID（根节点为 null）
- content: 节点内容（包含一个或多个 tab）
- children: 子节点数组（递归结构）
- status: 节点状态（active, in-progress, completed 等）
- excludeFromRAG: 是否从 RAG 中排除

请生成一个合理、可执行的 roadmap 结构。每个子节点应该是父节点的具体行动步骤，可以进一步分解。

${rrRootNodeId ? `**重要：生成的所有节点都将关联到当前的 rrRootId: ${rrRootNodeId}**` : ''}`;

  return tool(
    ({
      goal,
      description,
      childCount: _childCount,
      parentId: _parentId,
    }: GenerateReverseRoadmapInput) => {
      // 这个工具实际上只是让 LLM 生成结构化的 JSON
      // 实际执行由 LangChain 的 tool calling 机制处理
      return JSON.stringify({
        success: true,
        message: 'Reverse roadmap structure generated',
        goal,
        description,
        rrRootNodeId,
      });
    },
    {
      name: 'generate_reverse_roadmap',
      description,
      schema: z.object({
        goal: z.string().describe('用户的目标或要解决的问题'),
        description: z.string().optional().describe('目标的详细描述（可选）'),
        childCount: z
          .number()
          .optional()
          .describe('要生成的子节点数量（默认 3-5）'),
        parentId: z
          .union([z.string(), z.null()])
          .optional()
          .describe('父节点 ID，如果作为子节点添加到现有节点（可选）'),
      }),
    },
  );
}
