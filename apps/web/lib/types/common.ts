/**
 * 基础类型定义
 */

// 在前端 JavaScript/TypeScript 中，
// MongoDB 的 ObjectId 在网络传输时会被序列化为字符串格式，
// 所以前端接收到的都是字符串形式的 ID。
/** MongoDB ObjectId 类型 */
export type ObjectId = string;

/** 加载状态 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/** 异步状态管理 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch?: number;
}
