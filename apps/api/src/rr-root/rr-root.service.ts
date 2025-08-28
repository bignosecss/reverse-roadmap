import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateRrRootDto } from './dto/create-rr-root.dto';
import { UpdateRrRootDto } from './dto/update-rr-root.dto';
import { RrRoot } from 'src/schemas/rr-root.schema';

@Injectable()
export class RrRootService {
  constructor(@InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>) {}

  create(createRrRootDto: CreateRrRootDto) {
    return 'This action adds a new rrRoot';
  }

  findAll() {
    return this.rrRootModel.find().exec();
  }

  findOne(nodeId: string, treeId: string) {
    return `This action returns a #${nodeId} rrRoot from tree #${treeId}`;
  }

  update(id: string, updateRrRootDto: UpdateRrRootDto) {
    return `This action updates a #${id} rrRoot`;
  }

  remove(id: string) {
    return `This action removes a #${id} rrRoot`;
  }
}
