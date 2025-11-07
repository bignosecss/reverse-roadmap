import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { RrRoot } from '../schemas/rr-root.schema';

@Injectable()
export class RrRootRepository {
  constructor(@InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>) {}

  async create(rrRootEntity: Partial<RrRoot>): Promise<RrRoot> {
    const newRrRoot = new this.rrRootModel(rrRootEntity);
    return newRrRoot.save();
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

  async findById(id: string): Promise<RrRoot | null> {
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
