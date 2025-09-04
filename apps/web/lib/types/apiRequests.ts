export interface CreateRrRootDto {
  title: string;
}

export interface UpdateRrRootDto extends Partial<CreateRrRootDto> {
  rootId: string;
}

export interface CreateRrNodeDto {
  title: string;
  parentId: string | null;
  description?: string;
}

export type UpdateRrNodeDto = Partial<CreateRrNodeDto>;
