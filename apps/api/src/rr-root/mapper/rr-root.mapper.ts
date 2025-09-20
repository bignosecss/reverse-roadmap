import { Injectable } from '@nestjs/common';
import { CreateRrRootDto } from '../dto/create-rr-root.dto';
import { UpdateRrRootDto } from '../dto/update-rr-root.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RrRoot } from 'src/schemas/rr-root.schema';
import { Model } from 'mongoose';

@Injectable()
export class RrRootMapper {
  constructor(@InjectModel(RrRoot.name) private rrRoot: Model<RrRoot>) {}

  async create(createRrRootDto: CreateRrRootDto) {
    const newRootModel = await this.rrRoot.create(createRrRootDto);
    const newRoot = await newRootModel.save();

    return newRoot;
  }

  findAll() {
    return this.rrRoot.find().sort({ updatedAt: -1 }).exec();
  }

  async findOne(id: string) {
    const root = await this.rrRoot.findById(id).exec();
    if (!root) {
      throw new Error(`NOT FOUND: root id ${id} not exists`);
    }
    return root;
  }

  async update(id: string, updateRrRootDto: UpdateRrRootDto) {
    const root = await this.rrRoot
      .findByIdAndUpdate(id, updateRrRootDto)
      .exec();
    if (!root) {
      throw new Error(
        `FAIL TO UPDATE: root id ${id} not exists or something else unexpected happend`,
      );
    }
    return root;
  }

  async remove(id: string) {
    const root = await this.rrRoot.findByIdAndDelete(id).exec();
    if (!root) {
      throw new Error(
        `FAIL TO DELETE: root id ${id} not exists or something else unexpected happend`,
      );
    }
    return root;
  }
}
