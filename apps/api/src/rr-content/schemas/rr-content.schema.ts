import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RrContentDocument = HydratedDocument<RrContent>;

@Schema({ collection: 'rr_contents' })
export class RrContent {
  @Prop({ type: String })
  tabTitle!: string;

  @Prop({ type: String, required: true })
  type!: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  content!: any[];

  @Prop({ type: Date, required: true })
  createdAt!: Date;

  @Prop({ type: Date, required: true })
  updatedAt!: Date;
}

export const RrContentSchema = SchemaFactory.createForClass(RrContent);
