import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, collection: 'rr_nodes' })
export class RrNode {
  @Prop({ required: true, type: String })
  title!: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RrNode', default: null })
  parentId!: mongoose.Schema.Types.ObjectId | null;

  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] })
  children!: RrNode[];
}

export const RrNodeSchema = SchemaFactory.createForClass(RrNode);

// 手动定义递归结构
const NestedNodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'RrNode', default: null },
  children: []
}, { timestamps: true });

// 递归设置 children 字段
NestedNodeSchema.add({ children: [NestedNodeSchema] });

// 更新主 Schema 的 children 字段
RrNodeSchema.add({
  children: [NestedNodeSchema]
});
