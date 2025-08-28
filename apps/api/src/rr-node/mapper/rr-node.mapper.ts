import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RrNode } from 'src/schemas/rr-node.schema';
import { CreateRrNodeDto } from '../dto/create-rr-node.dto';
import { UpdateRrNodeDto } from '../dto/update-rr-node.dto';

@Injectable()
export class RrNodeMapper {
  constructor(@InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>) {}

  async createTree(createRrNodeDto: CreateRrNodeDto) {
    const newTreeRootNode = new this.rrNodeModel(createRrNodeDto);
    const res = await newTreeRootNode.save();

    return res.toJSON();
  }

  async createNode(
    treeId: string,
    parentNodeId: string,
    createRrNodeDto: CreateRrNodeDto,
  ) {
    const newNode = new this.rrNodeModel(createRrNodeDto);

    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    const parentObjectId = new mongoose.Types.ObjectId(parentNodeId);

    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      return null;
    }

    const parentNode = this._findNodeRecursive(targetTree, parentObjectId);
    if (!parentNode) {
      return null;
    }
    parentNode.children.push(newNode);

    await targetTree.save();
    return newNode;
  }

  findAllTrees() {
    return this.rrNodeModel.find().exec();
  }

  async findNodeById(treeId: string, nodeId: string) {
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);
    const treeObjectId = new mongoose.Types.ObjectId(treeId);

    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      return null;
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

    const targetTree = await this.rrNodeModel.findById(treeObjectId);
    if (!targetTree) {
      return null;
    }

    const targetNode = this._findNodeRecursive(targetTree, nodeObjectId);
    if (!targetNode) {
      return null;
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

  async deleteTree(treeId: string) {
    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    const res = await this.rrNodeModel.findByIdAndDelete(treeObjectId).exec();
    if (!res) {
      throw new Error('Tree not found');
    }
    return res.toJSON();
  }

  async deleteNodeFromTree(treeId: string, nodeId: string) {
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);
    const treeObjectId = new mongoose.Types.ObjectId(treeId);

    const deleteFromChildren = (node: RrNode) => {
      const index = node.children.findIndex((child: RrNode) =>
        child._id.equals(nodeObjectId),
      );
      if (index !== -1) {
        node.children.splice(index, 1);
        return node.children[index];
      }
    };

    const targetTree = await this.rrNodeModel.findById(treeObjectId).exec();
    if (!targetTree) {
      return null;
    }
    const deletedNode = deleteFromChildren(targetTree);
    if (!deletedNode) {
      return null;
    }

    const res = await targetTree.save();
    return res.toJSON();
  }
}
