import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ type: String, enum: ['active', 'archived'], default: 'active' })
  status!: string;
}

export const RrRootSchema = SchemaFactory.createForClass(RrRoot);
