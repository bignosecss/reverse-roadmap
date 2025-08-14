import type { ObjectId } from "./common";

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
  rootId: ObjectId;
}

/** 更新节点请求 */
export interface UpdateNodeRequest {
  title?: string;
  description?: string;
  nodeId: ObjectId;
  rootId: ObjectId;
}

/** 删除节点请求 */
export interface DeleteNodeRequest {
  nodeId: ObjectId;
  rootId: ObjectId;
}
