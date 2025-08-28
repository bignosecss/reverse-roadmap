import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RrRootService } from './rr-root.service';
import { CreateRrRootDto } from './dto/create-rr-root.dto';
import { UpdateRrRootDto } from './dto/update-rr-root.dto';

@Controller('rr-root')
export class RrRootController {
  constructor(private readonly rrRootService: RrRootService) {}

  @Post()
  create(@Body() createRrRootDto: CreateRrRootDto) {
    return this.rrRootService.create(createRrRootDto);
  }

  @Get()
  findAll() {
    return this.rrRootService.findAll();
  }

  @Get('find')
  findOne(@Query('treeId') treeId: string, @Query('nodeId') nodeId: string) {
    return this.rrRootService.findOne(treeId, nodeId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRrRootDto: UpdateRrRootDto) {
    return this.rrRootService.update(id, updateRrRootDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rrRootService.remove(id);
  }
}
