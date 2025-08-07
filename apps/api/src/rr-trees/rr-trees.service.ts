import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RrTrees } from 'src/schemas/rr-trees.schema';

@Injectable()
export class RrTreesService {
  constructor(
    @InjectModel(RrTrees.name) private rrTreesModel: Model<RrTrees>,
  ) {}

  async findOne(id: Types.ObjectId) {
    return this.rrTreesModel.findById(id).exec();
  }
}
