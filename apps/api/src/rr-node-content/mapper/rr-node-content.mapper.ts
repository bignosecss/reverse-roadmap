import { Injectable } from '@nestjs/common';
import { UpdateRrNodeContentDto } from '../dto/update-rr-node-content.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RrNodeContent } from 'src/schemas/rr-node-content.schema';
import mongoose, { Model } from 'mongoose';
import { CreateRrNodeContentDto } from '../dto/create-rr-node-content.dto';

@Injectable()
export class RrNodeContentMapper {
  constructor(
    @InjectModel(RrNodeContent.name)
    private rrNodeContent: Model<RrNodeContent>,
  ) {}

  async create(createRrNodeContentDto: CreateRrNodeContentDto) {
    const newContenModel = new this.rrNodeContent(createRrNodeContentDto);
    const newContent = await newContenModel.save();
    return newContent;
  }

  findAll() {
    return this.rrNodeContent.find().exec();
  }

  async findOne(id: string) {
    const objectId = new mongoose.Types.ObjectId(id);
    const content = await this.rrNodeContent.findById(objectId);
    return content;
  }

  async update(id: string, updateRrNodeContentDto: UpdateRrNodeContentDto) {
    const objectId = new mongoose.Types.ObjectId(id);
    const updatedContent = await this.rrNodeContent.findByIdAndUpdate(
      objectId,
      updateRrNodeContentDto,
    );
    return updatedContent;
  }

  async remove(id: string) {
    const objectId = new mongoose.Types.ObjectId(id);
    const removedContent = await this.rrNodeContent.findByIdAndDelete(objectId);
    return removedContent;
  }
}
