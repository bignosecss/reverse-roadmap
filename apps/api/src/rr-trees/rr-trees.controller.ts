import { Controller, Get, Param } from '@nestjs/common';
import { RrTreesService } from './rr-trees.service';
import { Types } from 'mongoose';

@Controller('rr-trees')
export class RrTreesController {
  constructor(private readonly rrTreesService: RrTreesService) {}

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.rrTreesService.findOne(id);
  }
}
