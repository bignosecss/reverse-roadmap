import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RrNodeService } from './rr-node.service';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';

@Controller('rr-node')
export class RrNodeController {
  constructor(private readonly rrNodeService: RrNodeService) {}

  @Post()
  create(@Body() createRrNodeDto: CreateRrNodeDto) {
    return this.rrNodeService.create(createRrNodeDto);
  }

  @Get()
  findAll() {
    return this.rrNodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rrNodeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeService.update(id, updateRrNodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rrNodeService.remove(id);
  }
}
