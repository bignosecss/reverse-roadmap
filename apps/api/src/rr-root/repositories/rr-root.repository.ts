import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { RrRoot, RrRootDocument } from '../schemas/rr-root.schema';

@Injectable()
export class RrRootRepository {
  constructor(@InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>) {}

  save(rrRootEntity: RrRootDocument) {
    return rrRootEntity.save();
  }

  create(rrRootEntity: Partial<RrRoot>) {
    return new this.rrRootModel(rrRootEntity);
  }

  async findAll(
    filter: FilterQuery<RrRoot> = {},
    options: QueryOptions = {},
  ): Promise<RrRoot[]> {
    return this.rrRootModel
      .find(filter, null, options)
      .sort({ updatedAt: -1 })
      .exec();
  }

  async findById(id: string) {
    return this.rrRootModel.findById(id).exec();
  }

  async update(id: string, updateQuery: UpdateQuery<RrRoot>): Promise<RrRoot> {
    const existingRrRoot = await this.rrRootModel
      .findByIdAndUpdate(id, updateQuery, { new: true })
      .exec();
    if (!existingRrRoot) {
      throw new NotFoundException(`RrRoot with ID ${id} not found`);
    }
    return existingRrRoot;
  }

  async remove(id: string): Promise<RrRoot> {
    const removedRoot = await this.rrRootModel.findByIdAndDelete(id).exec();
    if (!removedRoot) {
      throw new NotFoundException(`RrRoot with ID ${id} not found`);
    }
    return removedRoot;
  }
}
