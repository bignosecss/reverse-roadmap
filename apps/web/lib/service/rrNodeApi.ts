import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { CreateNodeRequest } from "../types/apiRequests";
import { RrNode } from "../types/models";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * 创建新节点的 Mutation Hook
 * 使用乐观更新策略提升用户体验
 */
export const useCreateNode = (): UseMutationResult<
  RrNode,
  Error,
  CreateNodeRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateNodeRequest): Promise<RrNode> => {
      const response = await fetch(`${API_BASE_URL}/rr-node`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to create node: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: (newNode, variables) => {
      // 🔥 正确的缓存失效：使用 rootId 而不是 parentId
      queryClient.invalidateQueries({
        queryKey: ["rr-tree", variables.rootId.toString()],
      });
    },
    onError: (error) => {
      console.error("创建失败:", error);
      // 这里可以添加 toast 通知
    },
  });
};
