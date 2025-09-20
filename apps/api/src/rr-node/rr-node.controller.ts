import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RrNodeService } from './rr-node.service';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';

@Controller('rr-node')
export class RrNodeController {
  constructor(private readonly rrNodeService: RrNodeService) {}

  @Post('root')
  create(@Body() createRrNodeDto: CreateRrNodeDto) {
    return this.rrNodeService.createRootNode(createRrNodeDto);
  }

  @Post('child')
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

  @Get('findRoot')
  findRootNode(@Query('treeId') treeId: string) {
    if (!treeId) {
      throw new BadRequestException('treeId is a required query parameter.');
    }
    return this.rrNodeService.findRootNode(treeId);
  }

  @Get('findChild')
  findNode(@Query('treeId') treeId: string, @Query('nodeId') nodeId: string) {
    if (!treeId || !nodeId) {
      throw new BadRequestException(
        'treeId and nodeId are required query parameters.',
      );
    }
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

  @Delete('root')
  removeRootNode(@Query('treeId') treeId: string) {
    return this.rrNodeService.removeRootNode(treeId);
  }

  @Delete('child')
  removeNode(@Query('treeId') treeId: string, @Query('nodeId') nodeId: string) {
    return this.rrNodeService.removeNode(treeId, nodeId);
  }
}
