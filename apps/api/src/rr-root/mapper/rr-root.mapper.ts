import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RrRoot } from 'src/schemas/rr-root.schema';
import { RrNode } from 'src/schemas/rr-node.schema';
import { CreateRrRootDto } from '../dto/create-rr-root.dto';
import { UpdateRrRootDto } from '../dto/update-rr-root.dto';
import { RrNodeContentMapper } from 'src/rr-node-content/mapper/rr-node-content.mapper';

@Injectable()
export class RrRootMapper {
  constructor(
    @InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>,
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
    private readonly rrNodeContentMapper: RrNodeContentMapper,
  ) {}

  async create(createRrRootDto: CreateRrRootDto) {
    // 先创建树的根节点
    const newTreeRootNode = new this.rrNodeModel({
      title: createRrRootDto.title,
      description: createRrRootDto.description || undefined,
    });

    const savedTreeRootNode = await newTreeRootNode.save();

    // 为根节点创建默认的 content
    const defaultContent = {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    };
    await this.rrNodeContentMapper.createForNode(
      newTreeRootNode,
      defaultContent,
    );

    // 引用现有的跟节点
    const newRoot = new this.rrRootModel({
      title: createRrRootDto.title,
      treeRootNodeId: savedTreeRootNode._id,
    });

    const savedRoot = await newRoot.save();
    return savedRoot.toJSON();
  }

  findAll() {
    return this.rrRootModel.find().sort({ updatedAt: -1 }).exec();
  }

  findOne(id: string) {
    const objectId = new mongoose.Types.ObjectId(id);
    return this.rrRootModel.findById(objectId).exec();
  }

  update(id: string, updateRrRootDto: UpdateRrRootDto) {
    const objectId = new mongoose.Types.ObjectId(id);
    return this.rrRootModel
      .findByIdAndUpdate(objectId, updateRrRootDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    const objectId = new mongoose.Types.ObjectId(id);

    const targetRoot = await this.rrRootModel.findById(objectId).exec();
    if (!targetRoot || !targetRoot.treeRootNodeId) {
      throw new Error('Root not found or has no treeRootNodeId');
    }

    const treeRootNodeId = targetRoot.treeRootNodeId;

    // 先找到树节点，以便删除所有关联的 content
    const targetTree = await this.rrNodeModel.findById(treeRootNodeId).exec();
    if (targetTree) {
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
    }

    const deletedRoot = await this.rrRootModel
      .findByIdAndDelete(objectId)
      .exec();

    // 直接使用 rrNodeModel 删除树节点，避免循环依赖
    const deletedNode = await this.rrNodeModel
      .findByIdAndDelete(treeRootNodeId)
      .exec();

    const result = {
      deletedRoot: deletedRoot ? deletedRoot.toJSON() : null,
      deletedNode: deletedNode ? deletedNode.toJSON() : null,
    };

    return result;
  }
}
