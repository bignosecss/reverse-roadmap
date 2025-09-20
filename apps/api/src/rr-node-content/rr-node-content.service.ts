import { Injectable } from '@nestjs/common';
import { RrNodeContentMapper } from './mapper/rr-node-content.mapper';
import { UpdateRrNodeContentDto } from './dto/update-rr-node-content.dto';
import { CreateRrNodeContentDto } from './dto/create-rr-node-content.dto';

@Injectable()
export class RrNodeContentService {
  constructor(private readonly rrNodeContentMapper: RrNodeContentMapper) {}

  create(createRrNodeContentDto: CreateRrNodeContentDto) {
    return this.rrNodeContentMapper.create(createRrNodeContentDto);
  }

  findAll() {
    return this.rrNodeContentMapper.findAll();
  }

  findOne(id: string) {
    return this.rrNodeContentMapper.findOne(id);
  }

  update(id: string, updateRrNodeContentDto: UpdateRrNodeContentDto) {
    return this.rrNodeContentMapper.update(id, updateRrNodeContentDto);
  }

  async remove(id: string) {
    return await this.rrNodeContentMapper.remove(id);
  }
}
