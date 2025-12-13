import { RrNodeStatus } from "../models";

export interface CreateRrNodeDto {
  title: string;
  description?: string;
  parent: string | null;
  status?: RrNodeStatus;
}

export type UpdateRrNodeDto = Partial<CreateRrNodeDto>;
