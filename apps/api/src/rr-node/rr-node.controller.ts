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
import { RrNodeService } from './rr-node.service';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';

@Controller('rr-node')
export class RrNodeController {
  constructor(private readonly rrNodeService: RrNodeService) {}

  @Post('')
  createTree(@Body() createRrNodeDto: CreateRrNodeDto) {
    return this.rrNodeService.createTree(createRrNodeDto);
  }

  @Post(':treeId')
  createNode(
    @Param('treeId') treeId: string,
    @Body() createRrNodeDto: CreateRrNodeDto,
  ) {
    return this.rrNodeService.createNode(treeId, createRrNodeDto);
  }

  @Get()
  findAll() {
    return this.rrNodeService.findAll();
  }

  @Get('find')
  findTree(@Query('treeId') treeId: string) {
    return this.rrNodeService.findTree(treeId);
  }

  @Get('find')
  findNode(@Query('treeId') treeId: string, @Query('nodeId') nodeId: string) {
    return this.rrNodeService.findNode(treeId, nodeId);
  }

  @Patch(':treeId/nodes/:nodeId')
  update(
    @Param('treeId') treeId: string,
    @Param('nodeId') nodeId: string,
    @Body() updateRrNodeDto: UpdateRrNodeDto,
  ) {
    return this.rrNodeService.update(treeId, nodeId, updateRrNodeDto);
  }

  @Delete(':treeId')
  removeTree(@Param('treeId') treeId: string) {
    return this.rrNodeService.removeTree(treeId);
  }

  @Delete(':treeId/nodes/:nodeId')
  removeNode(@Param('treeId') treeId: string, @Param('nodeId') nodeId: string) {
    return this.rrNodeService.removeNode(treeId, nodeId);
  }
}
