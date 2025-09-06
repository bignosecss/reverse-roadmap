import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// Helper type for documents that include mongoose timestamps
export type RrRootDocument = RrRoot &
  mongoose.Document & { createdAt: Date; updatedAt: Date };

/**
 * 所有的字段都需要添加 ! 告诉 TypeScript 这个属性会被外部赋值
 * 否则会报错：属性"title"没有初始化表达式，且未在构造函数中明确赋值。
 *
 * rr_root collection
 * 用于存储所有的根节点
 */
@Schema({ timestamps: true, collection: 'rr_roots' })
export class RrRoot {
  @Prop({ required: true })
  title!: string; // 侧边栏显示的标题

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RrNode' })
  treeRootNodeId!: mongoose.Schema.Types.ObjectId; // 关联的树的根节点ID

  @Prop({ type: String, enum: ['active', 'archived'], default: 'active' })
  status!: string;

  // timestamps: true will create these fields at runtime,
  // but we declare them here so TypeScript knows they exist.
  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const RrRootSchema = SchemaFactory.createForClass(RrRoot);
