import { RrRootStatus } from "../models";

export interface CreateRrRootDto {
  title: string;
  description?: string;
  status: RrRootStatus;
}

export type UpdateRrRootDto = Partial<CreateRrRootDto>;
