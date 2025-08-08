/**
 * 统一 API 响应接口
 * 与前端 ApiResponse 接口保持一致
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
}

/**
 * 成功响应接口
 */
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * 错误响应接口
 */
export interface ErrorResponse extends ApiResponse<never> {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
