/**
 * 数据模型类型定义
 */

import type { ObjectId } from "./base";

/** 侧边栏数据 */
export interface RrRoot {
  _id: ObjectId;
  title: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

/** 思维导图节点 */
export interface RrNode {
  _id: ObjectId;
  title: string;
  description?: string;
  parentId: ObjectId | null;
  children: RrNode[] | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/** 思维导图树结构 */
export interface RrTree {
  _id: ObjectId;
  rootId: ObjectId;
  rootNode: RrNode;
}
