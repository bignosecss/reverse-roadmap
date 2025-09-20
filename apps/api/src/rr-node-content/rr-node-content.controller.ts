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

  // @Post()
  // create(
  //   @Query('treeId') treeId: string,
  //   @Query('nodeId') nodeId: string,
  //   @Body() createRrNodeContentDto: CreateRrNodeContentDto,
  // ) {
  //   return this.rrNodeContentService.create(
  //     treeId,
  //     nodeId,
  //     createRrNodeContentDto,
  //   );
  // }

  // @Post('for-node/:treeId/:nodeId')
  // createForNode(
  //   @Param('treeId') treeId: string,
  //   @Param('nodeId') nodeId: string,
  //   @Body() createRrNodeContentDto: CreateRrNodeContentDto,
  // ) {
  //   return this.rrNodeContentService.createForNode(
  //     treeId,
  //     nodeId,
  //     createRrNodeContentDto,
  //   );
  // }

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
