import { Injectable } from '@nestjs/common';
import { RrNodeContentMapper } from './mapper/rr-node-content.mapper';
import { CreateRrNodeContentDto } from './dto/create-rr-node-content.dto';
import { UpdateRrNodeContentDto } from './dto/update-rr-node-content.dto';
import { RrNode } from 'src/schemas/rr-node.schema';

@Injectable()
export class RrNodeContentService {
  constructor(private readonly rrNodeContentMapper: RrNodeContentMapper) {}

  async create(node: RrNode, createRrNodeContentDto: CreateRrNodeContentDto) {
    return this.rrNodeContentMapper.create(node, createRrNodeContentDto);
  }

  async createForNode(
    node: RrNode,
    createRrNodeContentDto: CreateRrNodeContentDto,
  ) {
    return this.rrNodeContentMapper.createForNode(node, createRrNodeContentDto);
  }

  async findAll() {
    return this.rrNodeContentMapper.findAll();
  }

  async findOne(id: string) {
    return this.rrNodeContentMapper.findOne(id);
  }

  async update(id: string, updateRrNodeContentDto: UpdateRrNodeContentDto) {
    return this.rrNodeContentMapper.update(id, updateRrNodeContentDto);
  }

  async remove(id: string) {
    // 先断开与节点的关联，再删除内容
    await this.rrNodeContentMapper.unlinkFromNode(id);
    return this.rrNodeContentMapper.remove(id);
  }
}
