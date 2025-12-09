import { RrNodeStatus } from "./enums.js";

/** 思维导图节点 */
export type NodeContent = {
  rrContent: string;
  tabTitle: string;
};

export interface RrNode {
  _id: string;
  title: string;
  description?: string;
  parent: string | null;
  content: NodeContent[];
  children: RrNode[];
  status?: RrNodeStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
