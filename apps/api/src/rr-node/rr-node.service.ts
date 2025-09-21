import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { RrNodeMapper } from './mapper/rr-node.mapper';
import { RrNodeContentService } from 'src/rr-node-content/rr-node-content.service';
import { RrNode } from 'src/schemas/rr-node.schema';
import mongoose from 'mongoose';

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

    // 查找父节点 (这里假设你的 mapper 或 service 中有 _findNodeRecursive 的实现)
    // 注意：一个更优的实现是在 Service 中直接操作，而不是依赖 Mapper 查找
    const parentNode = this.rrNodeMapper['_findNodeRecursive'](
      rootNode,
      new mongoose.Types.ObjectId(parentNodeId),
    );

    if (!parentNode) {
      throw new Error(
        'Parent node not found when trying to create a child node',
      );
    }

    // 1. 为子节点创建关联的内容 (这部分是正确的)
    const nodeContent = await this.rrNodeContentService.create(
      this.defaultTiptapContent,
    );

    // 2. 创建一个【普通JS对象】来代表新节点，而不是一个 Mongoose Model 实例
    const newNodeObject = {
      ...createRrNodeDto,
      _id: new mongoose.Types.ObjectId(), // Mongoose 会自动生成，但手动生成更明确
      parentId: parentNode._id,
      content: nodeContent._id,
      children: [],
    };

    // 3. 将这个普通对象推入父节点的 children 数组
    parentNode.children.push(newNodeObject as RrNode);

    // 4. 只保存一次根节点
    await rootNode.save();

    // 5. 返回刚刚创建的那个普通对象
    return newNodeObject;
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
    return this.rrNodeMapper.findNode(treeId, nodeId);
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
    if (!removedRootNode) {
      throw new Error("Can not remove the root node when trying to remove a root node");
    }
    await this.removeTiptapContent(removedRootNode);
    return removedRootNode;
  }

  async removeNode(treeId: string, nodeId: string): Promise<RrNode> {
    if (treeId === nodeId) {
      throw new Error(
        "If you are trying to remove a root node, there's a specific method to do that",
      );
    }

    const rootNode = await this.rrNodeMapper.findRootNode(treeId);
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);

    // 定义一个递归函数来查找并删除节点
    const findAndRemove = (
      node: RrNode,
      nodeObjectId: mongoose.Types.ObjectId,
    ): RrNode | undefined => {
      const index = node.children.findIndex((child) =>
        child._id.equals(nodeObjectId),
      );

      if (index !== -1) {
        const [removedNode] = node.children.splice(index, 1);
        return removedNode; // 找到并删除
      }

      for (const child of node.children) {
        const removedNode = findAndRemove(child, nodeObjectId);
        if (!removedNode) {
          return removedNode; // 在子树中找到并删除
        }
      }

      return undefined; // 未找到
    };

    const removedNode = findAndRemove(rootNode, nodeObjectId);

    if (!removedNode) {
      throw new NotFoundException(
        `Node with ID ${nodeId} not found in tree ${treeId}`,
      );
    }

    // 关键步骤：保存对根节点的修改
    await rootNode.save();

    // 删除与 removedNode 及其所有子节点相关的内容
    await this.removeTiptapContent(removedNode);

    return removedNode;
  }

  async removeTiptapContent(rootNode: RrNode) {
    if (rootNode.content) {
      await this.rrNodeContentService.remove(rootNode.content.toString());
    }
    while (rootNode.children.length > 0) {
      for (const child of rootNode.children) {
        await this.removeTiptapContent(child);
      }
    }
  }
}
