import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class RrNode {
  @Prop({ type: Types.ObjectId, auto: true }) // 自动生成_id
  _id!: Types.ObjectId;

  @Prop({ required: true, type: String })
  title!: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Types.ObjectId, default: null })
  parentId!: Types.ObjectId | null;

  @Prop({ type: [{ type: Object }], default: null }) // 递归定义子节点
  children!: RrNode[] | null;
}

export const RrNodeSchema = SchemaFactory.createForClass(RrNode);

// 设置递归引用
RrNodeSchema.add({
  children: [RrNodeSchema],
});
