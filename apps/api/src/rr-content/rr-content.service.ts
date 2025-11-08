import { Injectable } from '@nestjs/common';
import { CreateRrContentDto } from './dto/create-rr-content.dto';
import { UpdateRrContentDto } from './dto/update-rr-content.dto';
import { RrContentRepository } from './repositories/rr-content.repository';
import { DeleteResult } from 'mongoose';

@Injectable()
export class RrContentService {
  constructor(private readonly rrContentRepository: RrContentRepository) {}

  async create(createRrContentDto: CreateRrContentDto) {
    const newRrContent = this.rrContentRepository.create(createRrContentDto);
    return await this.rrContentRepository.save(newRrContent);
  }

  async findOne(id: string) {
    return this.rrContentRepository.findOne(id);
  }

  async update(id: string, updateRrContentDto: UpdateRrContentDto) {
    return this.rrContentRepository.update(id, updateRrContentDto);
  }

  async remove(id: string) {
    return this.rrContentRepository.remove(id);
  }

  async removeMany(ids: string[]): Promise<DeleteResult> {
    return this.rrContentRepository.removeMany(ids);
  }
}
