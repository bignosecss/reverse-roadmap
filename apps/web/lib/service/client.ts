import { ApiResponse } from "@repo/shared";
import { CONFIG } from "./config";

type ApiType = "api" | "rag";

const DEFAULT_FETCH_OPTIONS: RequestInit = {};
const REQUEST_TIMEOUT = 60000; // 60 seconds - increased for RAG export operations

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  apiType: ApiType = "api",
): Promise<ApiResponse<T>> {
  /**
   * React-Query默认设置了重试机制，所以在 apiClient 里不需要再实现重试逻辑。
   * 为了防止请求hang住，添加了请求超时的处理。
   * 以下是官方原文：
   * https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
   * Queries that fail are silently retried 3 times,
   * with exponential backoff delay before capturing
   * and displaying an error to the UI.
   */

  const baseUrl = apiType === "api" ? CONFIG.RR_API : CONFIG.RAG_API;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const response = await fetch(`${baseUrl}${endpoint}`, {
    signal: controller.signal,
    ...DEFAULT_FETCH_OPTIONS,
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error: ${response.status} ${errorBody}`);
  }

  return response.json() as Promise<ApiResponse<T>>;
}
