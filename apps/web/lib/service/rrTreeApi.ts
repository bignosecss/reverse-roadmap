import { UseQueryResult } from "@tanstack/react-query";
import { RrTree } from "../types/models";
import { useApiQuery } from "./baseApi";

/**
 * 获取指定根节点的思维导图树结构
 *
 * @param rootId - 根节点 ID
 * @returns UseQueryResult<RrTree | null> - 思维导图树结构或 null
 */
export const useGetRrTree = (rootId: string): UseQueryResult<RrTree | null> => {
  return useApiQuery<RrTree, RrTree | null>({
    endpoint: `/rr-tree?rootId=${rootId}`,
    queryKey: ["rr-tree", rootId],
    select: (response) => response.data || null, // 🔥 返回 null 而不是空对象
    enabled: !!rootId, // 只有当 rootId 存在时才启用查询
  });
};
