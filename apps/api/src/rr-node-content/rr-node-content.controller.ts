import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RrNodeContentService } from './rr-node-content.service';
import { CreateRrNodeContentDto } from './dto/create-rr-node-content.dto';
import { UpdateRrNodeContentDto } from './dto/update-rr-node-content.dto';

@Controller('rr-node-content')
export class RrNodeContentController {
  constructor(private readonly rrNodeContentService: RrNodeContentService) {}

  @Post()
  create(
    @Body() createRrNodeContentDto: CreateRrNodeContentDto,
    @Query('nodeId') nodeId?: string,
  ) {
    return this.rrNodeContentService.create(createRrNodeContentDto, nodeId);
  }

  @Post('for-node/:nodeId')
  createForNode(
    @Param('nodeId') nodeId: string,
    @Body() createRrNodeContentDto: CreateRrNodeContentDto,
  ) {
    return this.rrNodeContentService.createForNode(
      nodeId,
      createRrNodeContentDto,
    );
  }

  @Get()
  findAll() {
    return this.rrNodeContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rrNodeContentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRrNodeContentDto: UpdateRrNodeContentDto,
  ) {
    return this.rrNodeContentService.update(id, updateRrNodeContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rrNodeContentService.remove(id);
  }
}
