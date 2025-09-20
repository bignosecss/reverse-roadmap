import { Injectable } from '@nestjs/common';
import { RrNode } from 'src/schemas/rr-node.schema';
import { CreateRrNodeDto } from '../dto/create-rr-node.dto';
import { UpdateRrNodeDto } from '../dto/update-rr-node.dto';

@Injectable()
export class RrNodeMapper {
  constructor() {}

  createNode(
    treeId: string,
    parentNodeId: string,
    createRrNodeDto: CreateRrNodeDto,
  ) {}

  findAll() {}

  findTree(treeId: string) {}

  findNode(treeId: string, nodeId: string) {}

  update(treeId: string, nodeId: string, updateRrNodeDto: UpdateRrNodeDto) {}

  removeTree(treeId: string) {}

  removeNode(treeId: string, nodeId: string) {}

  private deleteFromChildren(
    rootNode: RrNode,
    targetNodeId: string,
  ): RrNode | null {
    // DFS
    const childIndex = rootNode.children.findIndex((c) =>
      c._id.equals(targetNodeId),
    );
    if (childIndex !== -1) {
      const removed = rootNode.children.splice(childIndex, 1);
      const deletedNode = removed[0];
      if (!deletedNode) {
        throw new Error('Node not found after splice (unexpected)');
      }
      return deletedNode;
    }

    for (const child of rootNode.children) {
      const deletedNode = this.deleteFromChildren(child, targetNodeId);
      if (deletedNode) {
        return deletedNode;
      }
    }

    return null;
  }
}
