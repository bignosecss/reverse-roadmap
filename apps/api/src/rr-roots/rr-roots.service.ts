import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RrRoots } from 'src/schemas/rr-roots.schema';

@Injectable()
export class RrRootsService {
  constructor(
    @InjectModel(RrRoots.name) private rrRootsModel: Model<RrRoots>,
  ) {}

  async findAll(): Promise<RrRoots[]> {
    return this.rrRootsModel.find().exec();
  }

  remove(id: number) {
    return `This action removes a #${id} rrRoot`;
  }
}
