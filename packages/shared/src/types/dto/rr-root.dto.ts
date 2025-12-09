import { RrRootStatus } from "../models/enums.js";

export interface CreateRrRootDto {
  title: string;
  description?: string;
  status: RrRootStatus;
}

export type UpdateRrRootDto = Partial<CreateRrRootDto>;
