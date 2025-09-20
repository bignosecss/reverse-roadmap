import { Injectable } from '@nestjs/common';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { RrNodeMapper } from './mapper/rr-node.mapper';

@Injectable()
export class RrNodeService {
  constructor(private readonly rrNodeMapper: RrNodeMapper) {}

  async createRootNode(createRrNodeDto: CreateRrNodeDto) {}

  createNode(
    treeId: string,
    parentNodeId: string,
    createRrNodeDto: CreateRrNodeDto,
  ) {
    return this.rrNodeMapper.createNode(treeId, parentNodeId, createRrNodeDto);
  }

  findAll() {
    return this.rrNodeMapper.findAll();
  }

  findTree(treeId: string) {
    return this.rrNodeMapper.findTree(treeId);
  }

  findNode(treeId: string, nodeId: string) {
    return this.rrNodeMapper.findNode(nodeId, treeId);
  }

  update(treeId: string, nodeId: string, updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeMapper.update(treeId, nodeId, updateRrNodeDto);
  }

  removeTree(treeId: string) {
    return this.rrNodeMapper.removeTree(treeId);
  }

  removeNode(treeId: string, nodeId: string) {
    return this.rrNodeMapper.removeNode(treeId, nodeId);
  }
}
