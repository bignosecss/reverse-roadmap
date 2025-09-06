export interface CreateRrRootDto {
  title: string;
  description?: string;
}

export type UpdateRrRootDto = Partial<CreateRrRootDto>;

export interface CreateRrNodeDto {
  title: string;
  parentId: string | null;
  description?: string;
}

export type UpdateRrNodeDto = Partial<CreateRrNodeDto>;
