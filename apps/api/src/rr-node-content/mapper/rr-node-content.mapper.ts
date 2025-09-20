import { Injectable } from '@nestjs/common';
import { UpdateRrNodeContentDto } from '../dto/update-rr-node-content.dto';

@Injectable()
export class RrNodeContentMapper {
  constructor() {}

  create() {}

  findAll() {}

  findOne(id: string) {}

  update(id: string, updateRrNodeContentDto: UpdateRrNodeContentDto) {}

  remove(id: string) {}
}
