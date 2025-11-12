import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RrContentDocument = HydratedDocument<RrContent>;

@Schema({ timestamps: true, collection: 'rr_contents' })
export class RrContent {
  @Prop({ type: String })
  tabTitle!: string;

  @Prop({ type: String, required: true })
  type!: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  content!: any[];
}

export const RrContentSchema = SchemaFactory.createForClass(RrContent);
