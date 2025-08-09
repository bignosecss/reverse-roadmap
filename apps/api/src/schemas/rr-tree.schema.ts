import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RrNode } from './rr-node.schema';

/**
 * rr_tree collection
 * 用于存储所有的树
 */
@Schema({ timestamps: true, collection: 'rr_trees' })
export class RrTree {
  @Prop({ type: Types.ObjectId, ref: 'RrRoot', unique: true })
  rootId!: Types.ObjectId; // 关联根节点

  @Prop({ type: RrNode, required: true })
  rootNode!: RrNode;
}

export const RrTreeSchema = SchemaFactory.createForClass(RrTree);
