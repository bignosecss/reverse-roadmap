import { ApiResponse, GetRootsResponse, GetTreeResponse } from "./types/apiResponses";
import { ObjectId } from "./types/base";
import type { RrRoot, RrTree } from "./types/models";

const API_BASE_URL =
  process.env.NEST_PUBLIC_API_URL || "http://localhost:3001/api";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 获取思维导图根节点列表
 */
export async function getRrRoots(): Promise<GetRootsResponse> {
  const response = await apiRequest<RrRoot[]>("/rr-roots");

  if (!response.success || !response.data) {
    throw new Error(response.error || "获取根节点列表失败");
  }

  return {
    success: response.success,
    data: response.data,
    timestamp: response.timestamp,
    path: response.path,
  };
}

/**
 * 根据根节点 ID 获取完整的树结构
 */
export async function getRrTree(rootId: ObjectId): Promise<GetTreeResponse> {
  const response = await apiRequest<RrTree>(`/rr-trees?rootId=${rootId}`);

  if (!response.data) {
    throw new Error("获取思维导图树失败");
  }

  return {
    success: response.success,
    data: response.data,
    timestamp: response.timestamp,
    path: response.path,
  };
}
