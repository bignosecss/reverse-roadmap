import { Injectable } from '@nestjs/common';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RrNode } from 'src/schemas/rr-node.schema';
import { Model } from 'mongoose';

@Injectable()
export class RrNodeService {
  constructor(@InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>) {}

  create(createRrNodeDto: CreateRrNodeDto) {
    return 'This action adds a new rrNode';
  }

  findAll() {
    return this.rrNodeModel.find().exec();
  }

  findOne(id: string) {
    return this.rrNodeModel.findById(id).exec();
  }

  update(id: string, updateRrNodeDto: UpdateRrNodeDto) {
    return `This action updates a #${id} rrNode`;
  }

  remove(id: string) {
    return this.rrNodeModel.findByIdAndDelete(id).exec();
  }
}
