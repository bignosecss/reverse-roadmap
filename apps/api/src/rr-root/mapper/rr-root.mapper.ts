import { Injectable } from '@nestjs/common';
import { CreateRrRootDto } from '../dto/create-rr-root.dto';
import { UpdateRrRootDto } from '../dto/update-rr-root.dto';
@Injectable()
export class RrRootMapper {
  constructor() {}

  create(createRrRootDto: CreateRrRootDto) {}

  findAll() {}

  findOne(id: string) {}

  update(id: string, updateRrRootDto: UpdateRrRootDto) {}

  remove(id: string) {}
}
