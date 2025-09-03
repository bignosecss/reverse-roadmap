export interface CreateRrRootDto {
  title: string;
}

export interface UpdateRrRootDto extends Partial<CreateRrRootDto> {
  rootId: string;
}

export interface CreateRrNodeDto {
  title: string;
  parentId: string;
  description?: string;
}

export interface UpdateRrNodeDto extends Partial<CreateRrNodeDto> {
  nodeId: string;
}

export type RemoveRrNodeDto = Partial<UpdateRrNodeDto>;
