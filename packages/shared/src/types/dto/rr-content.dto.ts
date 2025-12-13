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
