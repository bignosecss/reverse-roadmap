import { UseQueryResult } from "@tanstack/react-query";
import { RrRoot } from "../types/models";
import { useApiQuery } from "./baseApi";

/**
 * 获取所有根节点列表
 *
 * @returns UseQueryResult<RrRoot[]> - 根节点数组
 */
export const useRrRoots = (): UseQueryResult<RrRoot[]> => {
  return useApiQuery<RrRoot[], RrRoot[]>({
    endpoint: "/rr-roots",
    queryKey: ["rr-roots"],
    select: (response) => response.data || [], // 🔥 关键：提取真正的数组数据
  });
};
