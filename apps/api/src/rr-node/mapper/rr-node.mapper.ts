import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RrNode } from 'src/schemas/rr-node.schema';
import { CreateRrNodeDto } from '../dto/create-rr-node.dto';
import { UpdateRrNodeDto } from '../dto/update-rr-node.dto';
import { RrRoot } from 'src/schemas/rr-root.schema';
import { RrNodeContentMapper } from 'src/rr-node-content/mapper/rr-node-content.mapper';

@Injectable()
export class RrNodeMapper {
  constructor(
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
    @InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>,
    private readonly rrNodeContentMapper: RrNodeContentMapper,
  ) {}

  async createTree(createRrNodeDto: CreateRrNodeDto) {
    // 先创建树的根节点
    const newTreeRootNode = new this.rrNodeModel(createRrNodeDto);
    const savedTreeRootNode = await newTreeRootNode.save();

    // 引用现有的跟节点
    const newRoot = new this.rrRootModel({
      treeRootNodeId: savedTreeRootNode._id,
      title: createRrNodeDto.title,
    });
    // 保存树的根节点引用
    await newRoot.save();

    return savedTreeRootNode.toJSON();
  }

  async createNode(treeId: string, createRrNodeDto: CreateRrNodeDto) {
    const newNode = new this.rrNodeModel(createRrNodeDto);

    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    const parentObjectId = new mongoose.Types.ObjectId(
      createRrNodeDto.parentId,
    );

    const rrRoot = await this.rrRootModel.findOne({
      treeRootNodeId: treeObjectId,
    });
    if (!rrRoot) {
      throw new Error('Root not found when creating a node');
    }

    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      throw new Error('Tree not found when creating a new node');
    }

    const parentNode = this._findNodeRecursive(targetTree, parentObjectId);
    if (!parentNode) {
      throw new Error('Parent node not found when creating a new node');
    }
    newNode.parentId = parentNode._id;
    parentNode.children.push(newNode);

    rrRoot.updatedAt = new Date();
    await rrRoot.save();

    await targetTree.save();
    return newNode;
  }

  findAllTrees() {
    return this.rrNodeModel.find().exec();
  }

  async findTreeById(treeId: string) {
    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      throw new Error(`Tree not found when trying to find by ID: ${treeId}`);
    }
    return targetTree;
  }

  async findNodeById(treeId: string, nodeId: string) {
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);
    const treeObjectId = new mongoose.Types.ObjectId(treeId);

    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      throw new Error('Tree not found when trying to find a node by ID');
    }

    const targetNode = this._findNodeRecursive(targetTree, nodeObjectId);

    return targetNode;
  }

  async updateNode(
    treeId: string,
    nodeId: string,
    updateRrNodeDto: UpdateRrNodeDto,
  ) {
    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);

    const rrRoot = await this.rrRootModel.findOne({
      treeRootNodeId: treeObjectId,
    });
    if (!rrRoot) {
      throw new Error('Root not found when trying to update a node');
    }

    const targetTree = await this.rrNodeModel.findById(treeObjectId);
    if (!targetTree) {
      throw new Error('Tree not found when trying to update a node');
    }

    const targetNode = this._findNodeRecursive(targetTree, nodeObjectId);
    if (!targetNode) {
      throw new Error('Node not found when trying to update a node');
    }

    if (updateRrNodeDto.title) {
      targetNode.title = updateRrNodeDto.title;
    }
    if (updateRrNodeDto.description !== undefined) {
      targetNode.description = updateRrNodeDto.description;
    } else {
      targetNode.description = '';
    }

    // 保存更新的树节点
    await targetTree.save();

    // 更新根节点的 updatedAt 字段（timestamps: true 会自动处理）
    // assign a Date object so TypeScript matches the schema declaration
    rrRoot.updatedAt = new Date();
    await rrRoot.save();

    return targetNode;
  }

  private _findNodeRecursive(
    tree: RrNode,
    nodeId: mongoose.Types.ObjectId,
  ): RrNode | null {
    if (tree._id.equals(nodeId)) {
      return tree;
    }

    for (const child of tree.children) {
      const found = this._findNodeRecursive(child, nodeId);
      if (found) {
        return found;
      }
    }

    return null;
  }

  async removeTree(treeId: string) {
    const treeObjectId = new mongoose.Types.ObjectId(treeId);

    // 先找到树节点，以便删除所有关联的 content
    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      throw new Error('Tree not found when trying to delete a tree');
    }

    // 递归删除所有节点关联的 content
    const deleteContentRecursive = async (node: RrNode) => {
      if (node.content) {
        await this.rrNodeContentMapper.remove(node.content.toString());
      }
      for (const child of node.children) {
        await deleteContentRecursive(child);
      }
    };

    await deleteContentRecursive(targetTree);

    const removedRootOfThisTree = await this.rrRootModel
      .findOneAndDelete({
        treeRootNodeId: treeObjectId,
      })
      .exec();
    if (!removedRootOfThisTree) {
      throw new Error('Root not found when trying to delete a tree');
    }

    const removedTree = await this.rrNodeModel
      .findByIdAndDelete(treeObjectId)
      .exec();
    if (!removedTree) {
      throw new Error('Tree not found when trying to delete a tree');
    }

    return {
      removedRootOfThisTree: removedRootOfThisTree.toJSON(),
      removedTree: removedTree.toJSON(),
    };
  }

  async removeNodeFromTree(treeId: string, nodeId: string) {
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);
    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    if (nodeObjectId.equals(treeObjectId)) {
      throw new Error('Cannot delete the root node of the tree');
    }

    const deleteFromChildren = (root: RrNode): RrNode | null => {
      // DFS
      const childIndex = root.children.findIndex((c) =>
        c._id.equals(nodeObjectId),
      );
      if (childIndex !== -1) {
        const removed = root.children.splice(childIndex, 1);
        const deletedNode = removed[0];
        if (!deletedNode) {
          throw new Error('Node not found after splice (unexpected)');
        }
        return deletedNode;
      }

      for (const child of root.children) {
        const deletedNode = deleteFromChildren(child);
        if (deletedNode) {
          return deletedNode;
        }
      }

      return null;
    };

    const rrRoot = await this.rrRootModel.findOne({
      treeRootNodeId: treeObjectId,
    });
    if (!rrRoot) {
      throw new Error('Root not found when trying to delete a node');
    }

    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      throw new Error('Tree not found when trying to delete a node');
    }
    const deletedNode = deleteFromChildren(targetTree);
    if (!deletedNode) {
      throw new Error('Node not found when trying to delete a node');
    }

    // 删除节点关联的 content
    if (deletedNode.content) {
      await this.rrNodeContentMapper.remove(deletedNode.content.toString());
    }

    rrRoot.updatedAt = new Date();
    await rrRoot.save();

    await targetTree.save();

    return deletedNode;
  }
}
