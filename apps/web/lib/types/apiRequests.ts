import { RrRootStatus } from "./models";

export interface CreateRrRootDto {
  title: string;
  description?: string;
  status: RrRootStatus;
}

export type UpdateRrRootDto = Partial<CreateRrRootDto>;

export interface CreateRrNodeDto {
  title: string;
  description?: string;
  parent: string | null;
}

export type UpdateRrNodeDto = Partial<CreateRrNodeDto>;

export interface CreateRrContentDto {
  type: "doc";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
}

export type UpdateRrContentDto = CreateRrContentDto;

export interface UpdateRrContentTabDto {
  rrContent: string;
  tabTitle: string;
}

export interface SwitchModeDto {
  password: string;
}
