import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { RrNodeService } from './rr-node.service';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';

@Controller('rr-node')
export class RrNodeController {
  constructor(private readonly rrNodeService: RrNodeService) {}

  @Post()
  create(@Body() createRrNodeDto: CreateRrNodeDto) {
    return this.rrNodeService.create(createRrNodeDto);
  }

  @Get(':id')
  findNode(@Param('id') id: string) {
    return this.rrNodeService.findNode(id);
  }

  @Get('tree/:id')
  findTree(@Param('id') id: string) {
    return this.rrNodeService.findTree(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRrNodeDto: UpdateRrNodeDto) {
    return this.rrNodeService.update(id, updateRrNodeDto);
  }

  @Delete(':id')
  removeNode(@Param('id') id: string) {
    return this.rrNodeService.removeNode(id);
  }

  @Delete('root/:id')
  removeTree(@Param('id') id: string) {
    return this.rrNodeService.removeTree(id);
  }
}
