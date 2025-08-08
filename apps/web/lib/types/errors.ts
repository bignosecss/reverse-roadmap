/**
 * 错误处理类型定义
 */

/** API 错误类型 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
}

/** 错误边界状态 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}
