import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RrNodeStatus as SharedRrNodeStatus } from '@repo/shared/models';

export type RrNodeDocument = HydratedDocument<RrNode>;

@Schema({ collection: 'rr_nodes', timestamps: true })
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
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        rrContent: { type: mongoose.Schema.Types.ObjectId, ref: 'RrContent' },
        tabTitle: { type: String },
      },
    ],
    default: [],
  })
  content!: {
    _id?: mongoose.Types.ObjectId;
    rrContent: mongoose.Types.ObjectId;
    tabTitle: string;
  }[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RrNode' }],
    default: [],
  })
  children!: mongoose.Types.ObjectId[];

  @Prop({
    type: String,
    enum: SharedRrNodeStatus,
    default: SharedRrNodeStatus.Active,
  })
  status!: SharedRrNodeStatus;

  @Prop({ type: Boolean, default: false })
  excludeFromRAG!: boolean;

  // Timestamps managed by Mongoose
  createdAt!: Date;
  updatedAt!: Date;
}

export const RrNodeSchema = SchemaFactory.createForClass(RrNode);
