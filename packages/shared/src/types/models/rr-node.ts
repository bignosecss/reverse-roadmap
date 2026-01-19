import { RrNodeStatus } from "./enums";

/** 思维导图节点 */
export type NodeContent = {
  _id: string;
  rrContent: string;
  tabTitle: string;
};

export interface RrNode {
  _id: string;
  title: string;
  description?: string;
  parent: string | null;
  content: NodeContent[];
  children: string[];
  status?: RrNodeStatus;
  excludeFromRAG?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
