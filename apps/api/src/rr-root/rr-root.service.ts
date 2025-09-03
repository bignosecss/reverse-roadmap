import { Injectable } from '@nestjs/common';
import { CreateRrRootDto } from './dto/create-rr-root.dto';
import { UpdateRrRootDto } from './dto/update-rr-root.dto';
import { RrRootMapper } from './mapper/rr-root.mapper';

@Injectable()
export class RrRootService {
  constructor(private readonly rrRootMapper: RrRootMapper) {}

  create(createRrRootDto: CreateRrRootDto) {
    return this.rrRootMapper.create(createRrRootDto);
  }

  findAll() {
    return this.rrRootMapper.findAll();
  }

  findOne(id: string) {
    return this.rrRootMapper.findOne(id);
  }

  update(id: string, updateRrRootDto: UpdateRrRootDto) {
    return this.rrRootMapper.update(id, updateRrRootDto);
  }

  remove(id: string) {
    return this.rrRootMapper.remove(id);
  }
}
