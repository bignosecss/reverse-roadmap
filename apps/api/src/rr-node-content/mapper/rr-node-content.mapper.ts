import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RrNodeContent } from 'src/schemas/rr-node-content.schema';
import { CreateRrNodeContentDto } from '../dto/create-rr-node-content.dto';
import { UpdateRrNodeContentDto } from '../dto/update-rr-node-content.dto';
import { RrNode } from 'src/schemas/rr-node.schema';

@Injectable()
export class RrNodeContentMapper {
  constructor(
    @InjectModel(RrNodeContent.name)
    private rrNodeContentModel: Model<RrNodeContent>,
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
  ) {}

  async create(node: RrNode, createRrNodeContentDto: CreateRrNodeContentDto) {
    if (!node) {
      throw new Error('Node not found when trying to create a rr-node-content');
    }

    const createdRrNodeContent = new this.rrNodeContentModel(
      createRrNodeContentDto,
    );
    const savedContent = await createdRrNodeContent.save();

    node.content = savedContent._id;

    return { nodeWithContent: node, savedContent };
  }

  async createForNode(
    node: RrNode,
    createRrNodeContentDto: CreateRrNodeContentDto,
  ) {
    return this.create(node, createRrNodeContentDto);
  }

  async findAll(): Promise<RrNodeContent[]> {
    return this.rrNodeContentModel.find().exec();
  }

  async findOne(nContentId: string): Promise<RrNodeContent | null> {
    return this.rrNodeContentModel.findById(nContentId).exec();
  }

  async update(
    nContentId: string,
    updateRrNodeContentDto: UpdateRrNodeContentDto,
  ): Promise<RrNodeContent | null> {
    return this.rrNodeContentModel
      .findByIdAndUpdate(nContentId, updateRrNodeContentDto, { new: true })
      .exec();
  }

  async remove(nContentId: string): Promise<RrNodeContent | null> {
    return this.rrNodeContentModel.findByIdAndDelete(nContentId).exec();
  }

  async unlinkFromNode(contentId: string): Promise<void> {
    await this.rrNodeModel
      .updateMany({ content: contentId }, { $set: { content: null } })
      .exec();
  }
}
