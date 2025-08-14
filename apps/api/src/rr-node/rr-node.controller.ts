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
import { DeleteNodeDto } from './dto/delete-rr-node.dto';

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

  @Get(':treeId/:nodeId')
  findOne(@Param('treeId') treeId: string, @Param('nodeId') nodeId: string) {
    return this.rrNodeService.findOneNode(treeId, nodeId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeService.update(+id, updateRrNodeDto);
  }

  @Delete()
  remove(@Body() deleteNodeDto: DeleteNodeDto) {
    return this.rrNodeService.removeNode(deleteNodeDto);
  }
}
