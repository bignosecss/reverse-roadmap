export interface RrContent {
  _id: string;
  tabTitle: string;
  type: "doc";
  // 方便起见，暂时使用 any 作为 tiptap 文档的类型( edirot.getJSON() )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[];
  createdAt: Date;
  updatedAt: Date;
}
