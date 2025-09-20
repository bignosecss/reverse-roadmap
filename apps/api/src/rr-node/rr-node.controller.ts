import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { RrNodeService } from './rr-node.service';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';

@Controller('rr-node')
export class RrNodeController {
  constructor(private readonly rrNodeService: RrNodeService) {}

  @Post()
  create(createRrNodeDto: CreateRrNodeDto) {
    return this.rrNodeService.createRootNode(createRrNodeDto);
  }

  @Post()
  createNode(
    @Query('treeId') treeId: string,
    @Query('parentNodeId') parentNodeId: string,
    @Body() createRrNodeDto: CreateRrNodeDto,
  ) {
    return this.rrNodeService.createNode(treeId, parentNodeId, createRrNodeDto);
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

  @Patch()
  update(
    @Query('treeId') treeId: string,
    @Query('nodeId') nodeId: string,
    @Body() updateRrNodeDto: UpdateRrNodeDto,
  ) {
    return this.rrNodeService.update(treeId, nodeId, updateRrNodeDto);
  }

  @Delete()
  removeTree(@Query('treeId') treeId: string) {
    return this.rrNodeService.removeTree(treeId);
  }

  @Delete()
  removeNode(@Query('treeId') treeId: string, @Query('nodeId') nodeId: string) {
    return this.rrNodeService.removeNode(treeId, nodeId);
  }
}
