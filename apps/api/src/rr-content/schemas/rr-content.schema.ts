import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RrContentDocument = HydratedDocument<RrContent>;

@Schema({ collection: 'rr_contents', timestamps: true })
export class RrContent {
  @Prop({ type: String })
  tabTitle!: string;

  @Prop({ type: String, required: true })
  type!: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  content!: any[];

  // Timestamps managed by Mongoose
  createdAt!: Date;
  updatedAt!: Date;
}

export const RrContentSchema = SchemaFactory.createForClass(RrContent);
