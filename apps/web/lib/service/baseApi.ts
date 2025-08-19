import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
} from "@tanstack/react-query";
import { ApiResponse } from "../types/apiResponses";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * 通用 API 错误处理
 */
const handleApiError = (result: ApiResponse) => {
  if (!result.success && result.error) {
    console.error("🚨 API Response Error:", {
      error: result.error,
      message: result.message,
      timestamp: result.timestamp,
      path: result.path,
    });
    throw new Error(result.error || result.message || "API returned error");
  }
};

/**
 * 通用 API 请求函数
 */
const fetchApi = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  const result: ApiResponse<T> = await response.json();
  handleApiError(result);
  return result;
};

/**
 * 通用 API Query Hook 配置
 */
interface UseApiQueryConfig<TData, TSelected> {
  /** API 端点路径 */
  endpoint: string;
  /** Query Key 数组 */
  queryKey: (string | number)[];
  /** 数据选择器函数 */
  select?: (data: ApiResponse<TData>) => TSelected;
  /** 是否启用查询 */
  enabled?: boolean;
  /** 自定义 Query 选项 */
  options?: Omit<
    UseQueryOptions<ApiResponse<TData>, Error, TSelected>,
    "queryKey" | "queryFn" | "select"
  >;
}

/**
 * 通用 API Query Hook
 */
export const useApiQuery = <TData, TSelected = ApiResponse<TData>>({
  endpoint,
  queryKey,
  select,
  enabled = true,
  options = {},
}: UseApiQueryConfig<TData, TSelected>): UseQueryResult<TSelected> => {
  return useQuery({
    queryKey: [endpoint, ...queryKey], // 🔥 将 endpoint 包含在 queryKey 中
    queryFn: () => fetchApi<TData>(endpoint),
    select,
    enabled,
    staleTime: 30 * 1000, // 30秒内认为数据是新鲜的
    retry: 3, // 失败时重试3次
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数退避：1s, 2s, 4s, 最大30s
    refetchOnWindowFocus: true, // 窗口重新获得焦点时重新获取数据
    ...options, // 允许覆盖默认配置
  });
};
