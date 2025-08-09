import { useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";
import { RrRoot } from "../types/models";
import { GetRootsResponse } from "../types/apiResponses";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const fetchRrRoots = async (): Promise<GetRootsResponse> => {
  const response = await fetch(`${API_BASE_URL}/rr-roots`);
  if (!response.ok) {
    throw new Error("Failed to fetch rr roots");
  }

  const result: GetRootsResponse = await response.json();
  if (!result.success && result.error) {
    console.error("🚨 API Response Error:", {
      error: result.error,
      message: result.message,
      timestamp: result.timestamp,
      path: result.path,
    });
    throw new Error(result.error || result.message || "API returned error");
  }

  return result;
};

export const useRrRoots = (): UseQueryResult<RrRoot[]> => {
  return useQuery({
    queryKey: ["rr-roots"],
    queryFn: fetchRrRoots,
    select: (response) => response.data || [], // 🔥 关键：提取真正的数组数据
    staleTime: 5 * 60 * 1000, // 5分钟内认为数据是新鲜的
    retry: 3, // 失败时重试3次
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数退避：1s, 2s, 4s, 最大30s
  });
};
