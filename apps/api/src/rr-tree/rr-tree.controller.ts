import { Controller, Get, Param } from '@nestjs/common';
import { RrTreeService } from './rr-tree.service';
import { RrTree } from 'src/schemas/rr-tree.schema';

@Controller('rr-tree')
export class RrTreeController {
  constructor(private readonly rrTreeService: RrTreeService) {}

  /**
   * 根据ID获取树结构
   * @param id - 根节点ID
   * @returns Promise<RrTree> - 树结构数据
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RrTree> {
    return this.rrTreeService.findOne(id);
  }
}
