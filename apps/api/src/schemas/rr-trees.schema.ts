import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RrNode } from './rr-node.schema';

@Schema({ timestamps: true })
export class RrTrees {
  @Prop({ type: Types.ObjectId, ref: 'RrRoots', unique: true })
  rootId!: Types.ObjectId; // 关联根节点

  @Prop({ type: RrNode, required: true })
  rootNode!: RrNode;
}

export const RrTreesSchema = SchemaFactory.createForClass(RrTrees);
