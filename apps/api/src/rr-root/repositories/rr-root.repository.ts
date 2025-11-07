import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { RrRoot } from '../entities/rr-root.entity';

@Injectable()
export class RrRootRepository {
  constructor(
    @InjectModel(RrRoot.name)
    private readonly rrRootModel: Model<RrRoot>,
  ) {}

  async create(rrRootEntity: Partial<RrRoot>): Promise<RrRoot> {
    const newRoot = new this.rrRootModel(rrRootEntity);
    return newRoot.save();
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
    const existingRoot = await this.rrRootModel
      .findByIdAndUpdate(id, updateQuery, { new: true })
      .exec();

    if (!existingRoot) {
      throw new NotFoundException(`RrRoot with ID ${id} not found`);
    }
    return existingRoot;
  }

  async remove(id: string): Promise<RrRoot> {
    const removedRoot = await this.rrRootModel.findByIdAndDelete(id).exec();
    if (!removedRoot) {
      throw new NotFoundException(`RrRoot with ID ${id} not found`);
    }
    return removedRoot;
  }
}
