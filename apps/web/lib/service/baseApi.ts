import {
  useQuery,
  UseQueryResult,
  UseQueryOptions,
  useMutation,
  UseMutationResult,
  UseMutationOptions,
  useQueryClient,
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
 * 通用 API Mutation 请求函数
 */
const fetchApiMutation = async <TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  variables: TVariables
): Promise<TData> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${method.toLowerCase()} ${endpoint}: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
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

/**
 * 通用 API Mutation Hook 配置
 */
interface UseApiMutationConfig<TData, TVariables> {
  /** API 端点路径 */
  endpoint: string;
  /** HTTP 方法 */
  method: 'POST' | 'PATCH' | 'DELETE';
  /** 获取需要失效的缓存键的函数 */
  getInvalidateKeys?: (variables: TVariables) => string[];
  /** 成功回调函数 */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** 自定义 Mutation 选项 */
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    'mutationFn' | 'onSuccess'
  >;
}

/**
 * 通用 API Mutation Hook
 * 自动处理缓存失效和数据重新获取
 */
export const useApiMutation = <TData, TVariables>({
  endpoint,
  method,
  getInvalidateKeys,
  onSuccess,
  options = {},
}: UseApiMutationConfig<TData, TVariables>): UseMutationResult<TData, Error, TVariables> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) => 
      fetchApiMutation<TData, TVariables>(endpoint, method, variables),
    onSuccess: (data, variables) => {
      // 如果提供了缓存键获取函数，则失效相关缓存
      if (getInvalidateKeys) {
        const keysToInvalidate = getInvalidateKeys(variables);
        
        keysToInvalidate.forEach(key => {
          // 使用 predicate 精确匹配缓存键
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === key,
          });
          
          // 立即重新获取数据
          queryClient.refetchQueries({
            predicate: (query) => query.queryKey[0] === key,
          });
        });
      }
      
      // 调用用户自定义的 onSuccess
      onSuccess?.(data, variables);
    },
    ...options,
  });
};
