import { Injectable } from '@nestjs/common';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { RrNodeMapper } from './mapper/rr-node.mapper';

@Injectable()
export class RrNodeService {
  constructor(private readonly rrNodeMapper: RrNodeMapper) {}

  createTree(createRrNodeDto: CreateRrNodeDto) {
    return this.rrNodeMapper.createTree(createRrNodeDto);
  }

  createNode(treeId: string, createRrNodeDto: CreateRrNodeDto) {
    return this.rrNodeMapper.createNode(treeId, createRrNodeDto);
  }

  findAll() {
    return this.rrNodeMapper.findAllTrees();
  }

  findTree(treeId: string) {
    return this.rrNodeMapper.findTreeById(treeId);
  }

  findNode(treeId: string, nodeId: string) {
    return this.rrNodeMapper.findNodeById(nodeId, treeId);
  }

  update(treeId: string, updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeMapper.updateNode(treeId, updateRrNodeDto);
  }

  removeTree(treeId: string) {
    return this.rrNodeMapper.removeTree(treeId);
  }

  async removeNode(treeId: string, nodeId: string) {
    return this.rrNodeMapper.removeNodeFromTree(treeId, nodeId);
  }
}
