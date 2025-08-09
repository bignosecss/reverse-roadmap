import { useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";
import { RrTree } from "../types/models";
import { GetTreeResponse } from "../types/apiResponses";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const fetchRrTree = async (rootId: string): Promise<GetTreeResponse> => {
  const response = await fetch(`${API_BASE_URL}/rr-tree?rootId=${rootId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch rr tree");
  }

  const result: GetTreeResponse = await response.json();
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

export const useRrTree = (rootId: string): UseQueryResult<RrTree | null> => {
  return useQuery({
    queryKey: ["rr-tree", rootId],
    queryFn: () => fetchRrTree(rootId),
    select: (response) => response.data || null, // 🔥 返回 null 而不是空对象
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
