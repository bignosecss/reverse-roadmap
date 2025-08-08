import type { RrRoot, RrTree } from "./models";

/** API 响应基础结构 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  path: string;
}

/** 获取根节点列表响应 */
export type GetRootsResponse = ApiResponse<RrRoot[]>;

/** 获取思维导图树响应 */
export type GetTreeResponse = ApiResponse<RrTree>;
