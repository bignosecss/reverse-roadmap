import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class RrNode {
  @Prop({ required: true, auto: true }) // 自动生成_id
  _id!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  parentId!: string | null;

  @Prop({ type: [RrNode] }) // 递归定义子节点
  children!: RrNode[] | null;
}
