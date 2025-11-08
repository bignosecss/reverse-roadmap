import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { RrContentService } from './rr-content.service';
import { CreateRrContentDto } from './dto/create-rr-content.dto';
import { UpdateRrContentDto } from './dto/update-rr-content.dto';

@Controller('rr-content')
export class RrContentController {
  constructor(private readonly rrContentService: RrContentService) {}

  @Post()
  async create(@Body() createRrContentDto: CreateRrContentDto) {
    return this.rrContentService.create(createRrContentDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rrContent = await this.rrContentService.findOne(id);
    if (!rrContent) {
      throw new NotFoundException(`RrContent with ID ${id} not found`);
    }
    return rrContent;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRrContentDto: UpdateRrContentDto,
  ) {
    const rrContent = await this.rrContentService.update(
      id,
      updateRrContentDto,
    );
    if (!rrContent) {
      throw new NotFoundException(`RrContent with ID ${id} not found`);
    }
    return rrContent;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const rrContent = await this.rrContentService.remove(id);
    if (!rrContent) {
      throw new NotFoundException(`RrContent with ID ${id} not found`);
    }
    return rrContent;
  }
}
