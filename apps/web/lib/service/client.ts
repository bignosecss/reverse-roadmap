import { ApiResponse } from "@repo/shared/apiResponse";
import { CONFIG } from "./config";

const BASE_URL = CONFIG.RR_API;
const DEFAULT_FETCH_OPTIONS: RequestInit = {};
const REQUEST_TIMEOUT = 15000; // 15 seconds

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    signal: controller.signal,
    ...DEFAULT_FETCH_OPTIONS,
    ...options,
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
