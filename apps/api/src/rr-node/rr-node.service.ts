import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { RrNode, RrNodeDocument } from './schemas/rr-node.schema';
import {
  RrNodeRepository,
  RrNodeTree,
} from './repositories/rr-node.repository';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { RrContentService } from 'src/rr-content/rr-content.service';

@Injectable()
export class RrNodeService {
  constructor(
    private readonly rrNodeRepository: RrNodeRepository,
    private readonly rrContentService: RrContentService,
  ) {}

  private readonly defaultTiptapContent = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  };

  async create(createRrNodeDto: CreateRrNodeDto) {
    const { parent: parentId, ...nodeData } = createRrNodeDto;

    let parentNode: RrNodeDocument | null = null;
    if (parentId) {
      parentNode = await this.rrNodeRepository.findById(parentId);
      if (!parentNode) {
        throw new NotFoundException(`ParentNode with ID ${parentId} not found`);
      }
    }

    // todo: 不允许手动创建根节点
    // 如果是创建 root 的过程中传递的 parent: null 即可接收
    // 如果是前端传递的 parent: null，抛出异常

    const rrNodeEntity: Partial<RrNode> = {
      ...nodeData,
      parent: parentNode ? parentNode._id : null,
    };

    const newRrNode = this.rrNodeRepository.create(rrNodeEntity);
    const newRrContent = await this.rrContentService.create(
      this.defaultTiptapContent,
    );
    newRrNode.content = newRrContent._id;

    if (parentNode) {
      parentNode.children.push(newRrNode._id);
      await parentNode.save();
    }

    return await this.rrNodeRepository.save(newRrNode);
  }

  findNode(id: string) {
    return this.rrNodeRepository.findById(id);
  }

  async findTree(rootRrNodeId: string): Promise<RrNodeTree> {
    const node = await this.rrNodeRepository.findById(rootRrNodeId);
    if (!node || !!node.parent) {
      throw new NotFoundException(
        `The node with ID ${rootRrNodeId} requested may not exist or not the root node's id`,
      );
    }

    const tree = await this.rrNodeRepository.findTreeById(rootRrNodeId);
    if (!tree) {
      throw new NotFoundException(`RootNode with ID ${rootRrNodeId} not found`);
    }
    return tree;
  }

  update(id: string, updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeRepository.update(id, updateRrNodeDto);
  }

  async remove(id: string) {
    const nodeToRemove = await this.rrNodeRepository.findById(id);
    if (!nodeToRemove) {
      throw new NotFoundException(`RrNode with ID ${id} not found`);
    }

    // Remove from parent's children array
    if (nodeToRemove.parent) {
      await this.rrNodeRepository.update(nodeToRemove.parent.toString(), {
        $pull: { children: nodeToRemove._id },
      });
    }

    const descendantIds = await this.rrNodeRepository.findDescendantIds(id);
    const allNodeIds = [id, ...descendantIds];

    const nodesToDelete = await this.rrNodeRepository.findByIds(allNodeIds);
    const contentIds = nodesToDelete
      .map((node) => node.content)
      .filter((contentId) => contentId !== null)
      .map((contentId) => contentId.toString());

    if (contentIds.length > 0) {
      await this.rrContentService.removeMany(contentIds);
    }

    await this.rrNodeRepository.removeMany(allNodeIds);

    return nodeToRemove;
  }
}
