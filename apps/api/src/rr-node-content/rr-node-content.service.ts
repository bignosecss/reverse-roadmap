import { Injectable } from '@nestjs/common';
import { RrNodeContentMapper } from './mapper/rr-node-content.mapper';
import { UpdateRrNodeContentDto } from './dto/update-rr-node-content.dto';

@Injectable()
export class RrNodeContentService {
  constructor(private readonly rrNodeContentMapper: RrNodeContentMapper) {}

  create() {
    return this.rrNodeContentMapper.create();
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

  remove(id: string) {
    return this.rrNodeContentMapper.remove(id);
  }
}
