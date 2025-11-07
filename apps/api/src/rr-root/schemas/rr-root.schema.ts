import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RrRootDocument = HydratedDocument<RrRoot>;

@Schema({ timestamps: true, collection: 'rr_roots' })
export class RrRoot {
  @Prop({ required: true })
  title!: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'RrNode' })
  rootRrNode!: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: ['active', 'archived'], default: 'active' })
  status!: string;
}

export const RrRootSchema = SchemaFactory.createForClass(RrRoot);
