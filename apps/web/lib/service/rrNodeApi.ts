import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  CreateNodeRequest,
  UpdateNodeRequest,
  DeleteNodeRequest,
} from "../types/apiRequests";
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

/**
 * 更新节点的 Mutation Hook
 * 更新节点后自动刷新缓存
 */
export const useUpdateNode = (): UseMutationResult<
  RrNode,
  Error,
  UpdateNodeRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateNodeRequest): Promise<RrNode> => {
      const response = await fetch(`${API_BASE_URL}/rr-node`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to update node: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: (_, variables) => {
      // 🔥 更新成功后刷新整个树的缓存
      queryClient.invalidateQueries({
        queryKey: ["rr-tree", variables.rootId.toString()],
      });
    },
    onError: (error) => {
      console.error("更新失败:", error);
      // 这里可以添加 toast 通知
    },
  });
};

/**
 * 删除节点的 Mutation Hook
 * 删除节点后自动刷新缓存
 */
export const useDeleteNode = (): UseMutationResult<
  void,
  Error,
  DeleteNodeRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DeleteNodeRequest): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/rr-node`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeId: request.nodeId,
          rootId: request.rootId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete node: ${response.statusText}`);
      }
    },
    onSuccess: (_, variables) => {
      // 🔥 删除成功后刷新整个树的缓存
      queryClient.invalidateQueries({
        queryKey: ["rr-tree", variables.rootId.toString()],
      });
    },
    onError: (error) => {
      console.error("删除失败:", error);
      // 这里可以添加 toast 通知
    },
  });
};
