import { FlowNode } from "../flow";
import { RrNodeStatus } from "../models";

export interface CreateRrNodeDto {
  title: string;
  description?: string;
  parent: string | null;
  status?: RrNodeStatus;
}

export type UpdateRrNodeDto = Partial<CreateRrNodeDto>;

export interface UpdateConnectionDto {
  nodes: FlowNode[];
}
