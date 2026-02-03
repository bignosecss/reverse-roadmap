import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VectorDocument = HydratedDocument<Vector>;

@Schema({ collection: 'rr_vectors', timestamps: true })
export class Vector {
  @Prop({ required: true })
  fileId!: string;

  @Prop({ required: true })
  vector!: number[];

  @Prop({ required: true })
  pageContent!: string;

  // @Prop({ required: true, type: Object })
  // metadata!: Record<string, any>;
}

export const VectorSchema = SchemaFactory.createForClass(Vector);
