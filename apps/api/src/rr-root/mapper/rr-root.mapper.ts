import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RrRoot } from 'src/schemas/rr-root.schema';
import { RrNode } from 'src/schemas/rr-node.schema';
import { RrNodeService } from 'src/rr-node/rr-node.service';
import { CreateRrRootDto } from '../dto/create-rr-root.dto';
import { UpdateRrRootDto } from '../dto/update-rr-root.dto';

@Injectable()
export class RrRootMapper {
  constructor(
    @InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>,
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
    private readonly rrNodeService: RrNodeService,
  ) {}

  async create(createRrRootDto: CreateRrRootDto) {
    // 先创建树的根节点
    const newTreeRootNode = new this.rrNodeModel({
      title: createRrRootDto.title,
    });

    const savedTreeRootNode = await newTreeRootNode.save();

    // 引用现有的跟节点
    const newRoot = new this.rrRootModel({
      ...createRrRootDto,
      treeRootNodeId: savedTreeRootNode._id,
    });

    const savedRoot = await newRoot.save();
    return savedRoot.toJSON();
  }

  findAll() {
    return this.rrRootModel.find().exec();
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
    // MongoDB `ObjectId` type DOES have a toString method
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const linkedTreeId = targetRoot.treeRootNodeId.toString();

    const deletedRoot = await this.rrRootModel
      .findByIdAndDelete(objectId)
      .exec();
    const deletedNode = await this.rrNodeService.removeTree(linkedTreeId);

    const result = {
      deletedRoot: deletedRoot ? deletedRoot.toJSON() : null,
      deletedNode,
    };

    return result;
  }
}
