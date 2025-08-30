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

  async removeNode(treeId: string, nodeId: string) {
    const targetNode = await this.rrNodeMapper.findNodeById(treeId, nodeId);
    if (!targetNode) {
      throw new Error('Node not found when trying to delete a node');
    }

    // 如果 parentId 字段为 null，证明这个节点是跟节点
    // 需要报错，因为该方法处理子节点
    if (targetNode.parentId === null) {
      throw new Error('Cannot delete the root node using this method');
    }

    return this.rrNodeMapper.deleteNodeFromTree(treeId, nodeId);
  }
}
