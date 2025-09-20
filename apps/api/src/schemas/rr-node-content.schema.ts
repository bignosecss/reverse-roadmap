import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, collection: 'rr_node_contents' })
export class RrNodeContent {
  _id!: mongoose.Types.ObjectId;
  @Prop({ type: String, required: true })
  type!: string;
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  content!: Array<any>;
}

export const RrNodeContentSchema = SchemaFactory.createForClass(RrNodeContent);

export type RrNodeContentDocument = RrNodeContent & mongoose.Document;
