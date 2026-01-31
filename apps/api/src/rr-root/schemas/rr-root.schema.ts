import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RrRootStatus as SharedRrRootStatus } from '@repo/shared/models';

export type RrRootDocument = HydratedDocument<RrRoot>;

@Schema({ collection: 'rr_roots' })
export class RrRoot {
  @Prop({ required: true })
  title!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RrNode' })
  rootRrNode!: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: SharedRrRootStatus,
    default: SharedRrRootStatus.active,
  })
  status!: SharedRrRootStatus;

  @Prop({ type: Date, required: true })
  createdAt!: Date;

  @Prop({ type: Date, required: true })
  updatedAt!: Date;
}

export const RrRootSchema = SchemaFactory.createForClass(RrRoot);
