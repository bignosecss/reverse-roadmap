import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { RrNodeContentService } from './rr-node-content.service';
import { UpdateRrNodeContentDto } from './dto/update-rr-node-content.dto';

@Controller('rr-node-content')
export class RrNodeContentController {
  constructor(private readonly rrNodeContentService: RrNodeContentService) {}

  @Post()
  create() {
    return this.rrNodeContentService.create();
  }

  @Get()
  findAll() {
    return this.rrNodeContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rrNodeContentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRrNodeContentDto: UpdateRrNodeContentDto,
  ) {
    return this.rrNodeContentService.update(id, updateRrNodeContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rrNodeContentService.remove(id);
  }
}
