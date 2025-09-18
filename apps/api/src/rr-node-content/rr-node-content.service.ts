import { Injectable } from '@nestjs/common';
import { CreateRrNodeContentDto } from './dto/create-rr-node-content.dto';
import { UpdateRrNodeContentDto } from './dto/update-rr-node-content.dto';

@Injectable()
export class RrNodeContentService {
  create(createRrNodeContentDto: CreateRrNodeContentDto) {
    return 'This action adds a new rrNodeContent';
  }

  findAll() {
    return `This action returns all rrNodeContent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rrNodeContent`;
  }

  update(id: number, updateRrNodeContentDto: UpdateRrNodeContentDto) {
    return `This action updates a #${id} rrNodeContent`;
  }

  remove(id: number) {
    return `This action removes a #${id} rrNodeContent`;
  }
}
