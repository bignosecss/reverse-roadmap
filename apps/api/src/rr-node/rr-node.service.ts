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

  createNode(
    treeId: string,
    parentNodeId: string,
    createRrNodeDto: CreateRrNodeDto,
  ) {
    return this.rrNodeMapper.createNode(treeId, parentNodeId, createRrNodeDto);
  }

  findAll() {
    return this.rrNodeMapper.findAllTrees();
  }

  findOne(treeId: string, nodeId: string) {
    return this.rrNodeMapper.findNodeById(nodeId, treeId);
  }

  update(treeId: string, nodeId: string, updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeMapper.updateNode(treeId, nodeId, updateRrNodeDto);
  }

  removeTree(treeId: string) {
    return this.rrNodeMapper.deleteTree(treeId);
  }

  removeNode(treeId: string, nodeId: string) {
    return this.rrNodeMapper.deleteNodeFromTree(treeId, nodeId);
  }
}
