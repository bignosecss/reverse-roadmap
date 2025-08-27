import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, collection: 'rr_nodes' })
export class RrNode {
  @Prop({ required: true, type: String })
  title!: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: mongoose.Types.ObjectId, default: null })
  parentId!: mongoose.Types.ObjectId | null;

  @Prop({ type: [mongoose.Types.ObjectId], default: [] }) // 递归定义子节点
  children!: mongoose.Types.ObjectId[];
}

export const RrNodeSchema = SchemaFactory.createForClass(RrNode);
