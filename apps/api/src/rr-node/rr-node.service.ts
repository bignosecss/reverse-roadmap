import { Injectable } from '@nestjs/common';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { RrNodeMapper } from './mapper/rr-node.mapper';
import { RrNodeContentService } from 'src/rr-node-content/rr-node-content.service';

@Injectable()
export class RrNodeService {
  constructor(
    private readonly rrNodeMapper: RrNodeMapper,
    private readonly rrNodeContentService: RrNodeContentService,
  ) {}

  private readonly defaultTiptapContent = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
  };

  async createRootNode(createRrNodeDto: CreateRrNodeDto) {
    const rootNode = await this.rrNodeMapper.createRootNode(createRrNodeDto);
    // 为根节点创建默认的 tiptap content
    const rootNodeContent = await this.rrNodeContentService.create(
      this.defaultTiptapContent,
    );
    rootNode.content = rootNodeContent._id;
    return await rootNode.save();
  }

  async createNode(
    treeId: string,
    parentNodeId: string,
    createRrNodeDto: CreateRrNodeDto,
  ) {
    const rootNode = await this.rrNodeMapper.findRootNode(treeId);
    if (!rootNode) {
      throw new Error('Root node not found when trying to create a child node');
    }
    const parentNode = await this.rrNodeMapper.findNode(treeId, parentNodeId);
    if (!parentNode) {
      throw new Error(
        'Parent node not found when trying to create a child node',
      );
    }
    const newNode = await this.rrNodeMapper.createNode(createRrNodeDto);
    const nodeContent = await this.rrNodeContentService.create(
      this.defaultTiptapContent,
    );

    newNode.content = nodeContent._id;
    newNode.parentId = parentNode._id;
    parentNode.children.push(newNode);

    await rootNode.save();
    return newNode;
  }

  findAll() {
    return this.rrNodeMapper.findAll();
  }

  findRootNode(treeId: string) {
    return this.rrNodeMapper.findRootNode(treeId);
  }

  findNode(treeId: string, nodeId: string) {
    if (treeId === nodeId) {
      throw new Error(
        "If you are trying to find root node, there's a specific method to do that",
      );
    }
    return this.rrNodeMapper.findNode(nodeId, treeId);
  }

  async update(
    treeId: string,
    nodeId: string,
    updateRrNodeDto: UpdateRrNodeDto,
  ) {
    if (treeId === nodeId) {
      return await this.rrNodeMapper.update(treeId, updateRrNodeDto);
    }

    const rootNdoe = await this.rrNodeMapper.findRootNode(treeId);
    if (!rootNdoe) {
      throw new Error('Root node not found when trying to update a child node');
    }
    const updatedNode = await this.rrNodeMapper.update(
      nodeId,
      updateRrNodeDto,
      rootNdoe,
    );
    if (!updatedNode) {
      throw new Error('Node needs to be updated not found');
    }
    updatedNode.title = updateRrNodeDto.title!;
    updatedNode.description = updateRrNodeDto.description;
    await rootNdoe.save();

    return updatedNode;
  }

  async removeRootNode(treeId: string) {
    const removedRootNode = await this.rrNodeMapper.removeRootNode(treeId);
    return removedRootNode;
  }

  removeNode(treeId: string, nodeId: string) {
    if (treeId === nodeId) {
      throw new Error(
        "If you are trying to remove a root node, there's a specific method to do that",
      );
    }
    return this.rrNodeMapper.removeNode(treeId, nodeId);
  }
}
