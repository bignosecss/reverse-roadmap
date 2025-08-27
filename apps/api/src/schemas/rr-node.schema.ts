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

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  children!: mongoose.Schema.Types.ObjectId[];
}

export const RrNodeSchema = SchemaFactory.createForClass(RrNode);
