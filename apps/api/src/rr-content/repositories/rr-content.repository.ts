import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, UpdateQuery } from 'mongoose';
import { RrContent, RrContentDocument } from '../schemas/rr-content.schema';

@Injectable()
export class RrContentRepository {
  constructor(
    @InjectModel(RrContent.name)
    private readonly rrContentModel: Model<RrContent>,
  ) {}

  save(rrContentEntity: RrContentDocument) {
    return rrContentEntity.save();
  }

  create(rrContentEntity: Partial<RrContent>) {
    return new this.rrContentModel(rrContentEntity);
  }

  async findOne(id: string) {
    return this.rrContentModel.findById(id).exec();
  }

  async update(id: string, updateQuery: UpdateQuery<RrContent>) {
    return this.rrContentModel
      .findByIdAndUpdate(id, updateQuery, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.rrContentModel.findByIdAndDelete(id).exec();
  }

  async removeMany(ids: string[]): Promise<DeleteResult> {
    return this.rrContentModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}
