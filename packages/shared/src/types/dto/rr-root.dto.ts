import { RrRootStatus } from "../models";

export interface CreateRrRootDto {
  title: string;
  description?: string;
  status: RrRootStatus;
  isPublic?: boolean;
}

export type UpdateRrRootDto = CreateRrRootDto;
