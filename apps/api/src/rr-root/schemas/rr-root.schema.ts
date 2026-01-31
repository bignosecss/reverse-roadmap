import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RrRootStatus as SharedRrRootStatus } from '@repo/shared/models';

export type RrRootDocument = HydratedDocument<RrRoot>;

@Schema({ collection: 'rr_roots', timestamps: true })
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

  // Timestamps managed by Mongoose
  createdAt!: Date;
  updatedAt!: Date;
}

export const RrRootSchema = SchemaFactory.createForClass(RrRoot);
