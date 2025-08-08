import type { ObjectId } from "./base";

/** 创建根节点请求 */
export interface CreateRootRequest {
  title: string;
  description?: string;
}

/** 创建子节点请求 */
export interface CreateNodeRequest {
  title: string;
  description?: string;
  parentId: ObjectId;
}

/** 更新节点请求 */
export interface UpdateNodeRequest {
  title?: string;
  description?: string;
}
