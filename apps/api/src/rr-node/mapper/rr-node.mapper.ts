import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RrNode } from 'src/schemas/rr-node.schema';
import { CreateRrNodeDto } from '../dto/create-rr-node.dto';
import { UpdateRrNodeDto } from '../dto/update-rr-node.dto';
import { RrRoot } from 'src/schemas/rr-root.schema';

@Injectable()
export class RrNodeMapper {
  constructor(
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
    @InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>,
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

  async updateNode(treeId: string, updateRrNodeDto: UpdateRrNodeDto) {
    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    const nodeObjectId = new mongoose.Types.ObjectId(updateRrNodeDto.nodeId);

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
    }

    const updatedTree = await targetTree.save();
    return updatedTree.toJSON();
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

    const removedRootOfThisTree = await this.rrRootModel
      .findOneAndDelete({
        treeRootNodeId: treeObjectId,
      })
      .exec();

    const removedTree = await this.rrNodeModel
      .findByIdAndDelete(treeObjectId)
      .exec();
    if (!removedTree) {
      throw new Error('Tree not found');
    }

    return [removedRootOfThisTree?.toJSON(), removedTree.toJSON()];
  }

  async removeNodeFromTree(treeId: string, nodeId: string) {
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);
    const treeObjectId = new mongoose.Types.ObjectId(treeId);

    const deleteFromChildren = (node: RrNode) => {
      const index = node.children.findIndex((child: RrNode) =>
        child._id.equals(nodeObjectId),
      );
      if (index !== -1) {
        const deletedNode = node.children[index];
        node.children.splice(index, 1);
        return deletedNode;
      }
    };

    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      throw new Error('Tree not found when trying to delete a node');
    }
    const deletedNode = deleteFromChildren(targetTree);
    if (!deletedNode) {
      throw new Error('Node not found when trying to delete a node');
    }

    const res = await targetTree.save();
    return res.toJSON();
  }
}
