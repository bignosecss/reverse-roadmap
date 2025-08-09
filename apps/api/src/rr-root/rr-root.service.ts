import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RrRoot } from 'src/schemas/rr-root.schema';

@Injectable()
export class RrRootService {
  constructor(@InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>) {}

  async findAll(): Promise<RrRoot[]> {
    return this.rrRootModel.find().exec();
  }

  remove(id: number) {
    return `This action removes a #${id} rrRoot`;
  }
}
