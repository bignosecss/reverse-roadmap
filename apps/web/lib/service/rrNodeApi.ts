import { UseMutationResult } from "@tanstack/react-query";
import {
  CreateNodeRequest,
  UpdateNodeRequest,
  DeleteNodeRequest,
} from "../types/apiRequests";
import { RrNode } from "../types/models";
import { useApiMutation } from "./baseApi";

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
  return useApiMutation<RrNode, CreateNodeRequest>({
    endpoint: "/rr-node",
    method: "POST",
    getInvalidateKeys: (variables) => [
      `/rr-tree/${variables.rootId.toString()}`,
    ],
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
  return useApiMutation<RrNode, UpdateNodeRequest>({
    endpoint: "/rr-node",
    method: "PATCH",
    getInvalidateKeys: (variables) => [
      `/rr-tree/${variables.rootId.toString()}`,
    ],
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
  return useApiMutation<RrNode, DeleteNodeRequest>({
    endpoint: "/rr-node",
    method: "DELETE",
    getInvalidateKeys: (variables) => [
      `/rr-tree/${variables.rootId.toString()}`,
    ],
  });
};
