import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RrContent } from '../schemas/rr-content.schema';
import { CreateRrContentDto } from '../dto/create-rr-content.dto';
import { UpdateRrContentDto } from '../dto/update-rr-content.dto';

@Injectable()
export class RrContentRepository {
  constructor(
    @InjectModel(RrContent.name)
    private readonly rrContentModel: Model<RrContent>,
  ) {}

  async create(createRrContentDto: CreateRrContentDto) {
    const createdRrContent = new this.rrContentModel(createRrContentDto);
    return createdRrContent.save();
  }

  async findOne(id: string) {
    return this.rrContentModel.findById(id).exec();
  }

  async update(id: string, updateRrContentDto: UpdateRrContentDto) {
    return this.rrContentModel
      .findByIdAndUpdate(id, updateRrContentDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.rrContentModel.findByIdAndDelete(id).exec();
  }
}
