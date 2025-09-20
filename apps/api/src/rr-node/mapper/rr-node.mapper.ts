import { Injectable } from '@nestjs/common';
import { RrNode } from 'src/schemas/rr-node.schema';
import { CreateRrNodeDto } from '../dto/create-rr-node.dto';
import { UpdateRrNodeDto } from '../dto/update-rr-node.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class RrNodeMapper {
  constructor(@InjectModel(RrNode.name) private rrNode: Model<RrNode>) {}

  async createRootNode(createRrNodeDto: CreateRrNodeDto) {
    const newRootNodeModel = await this.rrNode.create(createRrNodeDto);
    return await newRootNodeModel.save();
  }

  async createNode(createRrNodeDto: CreateRrNodeDto) {
    const newNodeModel = new this.rrNode(createRrNodeDto);
    return await newNodeModel.save();
  }

  findAll() {
    return this.rrNode.find().exec();
  }

  async findRootNode(treeId: string) {
    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    const rootNode = await this.rrNode.findById(treeObjectId).exec();
    if (!rootNode) {
      throw new Error('');
    }
    return rootNode;
  }

  async findNode(treeId: string, nodeId: string) {
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);

    const rootNode = await this.findRootNode(treeId);
    if (!rootNode) {
      throw new Error('Root node not found when trying to find a child node');
    }

    const targetNode = this._findNodeRecursive(rootNode, nodeObjectId);
    return targetNode;
  }

  async update(
    nodeId: string,
    updateRrNodeDto: UpdateRrNodeDto,
    rootNode?: RrNode,
  ) {
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);

    let updatedNode: RrNode | null = null;
    if (!rootNode) {
      // 更新根节点
      updatedNode = await this.rrNode.findByIdAndUpdate(
        nodeObjectId,
        updateRrNodeDto,
      );
    } else {
      // 返回需要更新的节点，交给 service 层更新
      updatedNode = this._findNodeRecursive(rootNode, nodeObjectId);
    }
    return updatedNode;
  }

  async removeRootNode(treeId: string) {
    const treeObjectId = new mongoose.Types.ObjectId(treeId);
    const removedRootNode = await this.rrNode.findByIdAndDelete(treeObjectId);
    return removedRootNode;
  }

  async removeNode(treeId: string, nodeId: string) {
    const nodeObjectId = new mongoose.Types.ObjectId(nodeId);
    const rootNode = await this.findRootNode(treeId);
    if (!rootNode) {
      throw new Error('Root node not found when trying to remove a child node');
    }

    const deleteNode = (
      rootNode: RrNode,
      id: mongoose.Types.ObjectId,
    ): RrNode | undefined => {
      while (rootNode.children.length > 0) {
        const i = rootNode.children.findIndex((c) => c._id.equals(id));
        if (i !== -1) {
          const [removedNode] = rootNode.children.splice(i, 1);
          return removedNode;
        } else {
          for (const child of rootNode.children) {
            const removedNode = deleteNode(child, id);
            if (removedNode) {
              return removedNode;
            }
          }
        }
      }
    };
    const removedNode = deleteNode(rootNode, nodeObjectId);
    if (!removedNode) {
      throw new Error(
        `The node you want to delete in tree ${rootNode._id.toString()} was not found`,
      );
    }
    return removedNode;
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
}
