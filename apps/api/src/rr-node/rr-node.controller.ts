import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { RrNodeService } from './rr-node.service';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { UpdateRrContentTabDto } from 'src/rr-content/dto/update-rr-content-tab.dto';
import { convertTreeToFlow } from '@repo/shared/utils';

@Controller('rr-node')
export class RrNodeController {
  constructor(private readonly rrNodeService: RrNodeService) {}

  @Post()
  create(@Body() createRrNodeDto: CreateRrNodeDto) {
    return this.rrNodeService.create(createRrNodeDto);
  }

  @Post(':id/contents')
  createRrContentForNode(@Param('id') id: string) {
    return this.rrNodeService.createRrContentForNode(id);
  }

  @Get(':id')
  findNode(@Param('id') id: string) {
    return this.rrNodeService.findNode(id);
  }

  @Get('tree/:id')
  async findTree(@Param('id') id: string) {
    const tree = await this.rrNodeService.findTree(id);
    // 这傻逼 eslint 为什么会给警告
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const flowData = convertTreeToFlow(tree);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return flowData;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeService.update(id, updateRrNodeDto);
  }

  @Patch('nodes/:nodeId/contents')
  updateRrContentForNode(
    @Param('nodeId') nodeId: string,
    @Body() updateRrContentTabDto: UpdateRrContentTabDto,
  ) {
    return this.rrNodeService.updateRrContentForNode(
      nodeId,
      updateRrContentTabDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rrNodeService.remove(id);
  }

  @Delete('nodes/:nodeId/contents/:contentId')
  removeNodeContent(
    @Param('nodeId') nodeId: string,
    @Param('contentId') contentId: string,
  ) {
    // 1. 删除 node 与 content 的关联关系
    // 2. 删除 content 实体本身
    return this.rrNodeService.removeNodeContent(nodeId, contentId);
  }
}
