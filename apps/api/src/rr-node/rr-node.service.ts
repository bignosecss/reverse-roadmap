import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { RrNode, RrNodeDocument } from './schemas/rr-node.schema';
import {
  RrNodeRepository,
  RrNodeTree,
} from './repositories/rr-node.repository';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';

@Injectable()
export class RrNodeService {
  constructor(private readonly rrNodeRepository: RrNodeRepository) {}

  async create(createRrNodeDto: CreateRrNodeDto) {
    const { parent: parentId, ...nodeData } = createRrNodeDto;

    let parentNode: RrNodeDocument | null = null;
    if (parentId) {
      parentNode = await this.rrNodeRepository.findById(parentId);
      if (!parentNode) {
        throw new NotFoundException(`ParentNode with ID ${parentId} not found`);
      }
    }

    const rrNodeEntity: Partial<RrNode> = {
      ...nodeData,
      parent: parentNode ? parentNode._id : null,
    };

    const newRrNode = await this.rrNodeRepository.create(rrNodeEntity);

    if (parentNode) {
      parentNode.children.push(newRrNode._id);
      await parentNode.save();
    }

    return newRrNode;
  }

  findNode(id: string) {
    return this.rrNodeRepository.findById(id);
  }

  async findTree(rootRrNodeId: string): Promise<RrNodeTree> {
    const tree = await this.rrNodeRepository.findTreeById(rootRrNodeId);
    if (!tree) {
      throw new NotFoundException(`RootNode with ID ${rootRrNodeId} not found`);
    }
    return tree;
  }

  update(id: string, updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeRepository.update(id, updateRrNodeDto);
  }

  async removeNode(id: string) {
    return await this.rrNodeRepository.removeNode(id);
    // todo
    // 还需要删除对应的 content
  }

  // todo
  removeTree(id: string) {
    return `Root node id: ${id}`;
  }
}
