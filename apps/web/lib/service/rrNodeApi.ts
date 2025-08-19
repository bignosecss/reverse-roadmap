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
      const rootId = variables.rootId.toString();

      // 使用正确的缓存键匹配
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === `/rr-tree/${rootId}`;
        },
      });

      // 立即重新获取数据，确保UI立即更新
      queryClient.refetchQueries({
        predicate: (query) => {
          return query.queryKey[0] === `/rr-tree/${rootId}`;
        },
      });
    },
    onError: (error) => {
      console.error("创建失败:", error);
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
      const rootId = variables.rootId.toString();

      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === `/rr-tree/${rootId}`;
        },
      });

      queryClient.refetchQueries({
        predicate: (query) => {
          return query.queryKey[0] === `/rr-tree/${rootId}`;
        },
      });
    },
    onError: (error) => {
      console.error("更新失败:", error);
    },
  });
};

/**
 * 删除节点的 Mutation Hook
 * 删除节点后自动刷新缓存
 */
export const useDeleteNode = (): UseMutationResult<
  RrNode,
  Error,
  DeleteNodeRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DeleteNodeRequest): Promise<RrNode> => {
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

      const result = await response.json();
      return result.data;
    },
    onSuccess: (_, variables) => {
      const rootId = variables.rootId.toString();

      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === `/rr-tree/${rootId}`;
        },
      });

      queryClient.refetchQueries({
        predicate: (query) => {
          return query.queryKey[0] === `/rr-tree/${rootId}`;
        },
      });
    },
    onError: (error) => {
      console.error("删除失败:", error);
    },
  });
};
