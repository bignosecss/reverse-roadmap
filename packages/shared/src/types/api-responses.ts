/**
 * API 响应基础结构
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
