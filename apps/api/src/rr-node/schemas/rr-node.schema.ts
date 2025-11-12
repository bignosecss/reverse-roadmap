import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RrNodeDocument = HydratedDocument<RrNode>;

@Schema({ timestamps: true, collection: 'rr_nodes' })
export class RrNode {
  @Prop({ required: true, type: String })
  title!: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RrNode', default: null })
  parent!: mongoose.Types.ObjectId | null;

  @Prop({
    type: [
      {
        rrContent: { type: mongoose.Schema.Types.ObjectId, ref: 'RrContent' },
        tabTitle: { type: String },
      },
    ],
    default: [],
  })
  content!: { rrContent: mongoose.Types.ObjectId; tabTitle: string }[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RrNode' }],
    default: [],
  })
  children!: mongoose.Types.ObjectId[];
}

export const RrNodeSchema = SchemaFactory.createForClass(RrNode);
