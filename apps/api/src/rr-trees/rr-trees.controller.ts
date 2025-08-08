import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { RrTreesService } from './rr-trees.service';
import { Types } from 'mongoose';
import { RrTrees } from 'src/schemas/rr-trees.schema';

@Controller('rr-trees')
export class RrTreesController {
  constructor(private readonly rrTreesService: RrTreesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RrTrees> {
    try {
      // 验证 ObjectId 格式
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException(
          {
            code: 'INVALID_OBJECT_ID',
            message: '无效的 ID 格式',
            details: `提供的 ID "${id}" 不是有效的 MongoDB ObjectId`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const objectId = new Types.ObjectId(id);
      const tree = await this.rrTreesService.findOne(objectId);

      if (!tree) {
        throw new NotFoundException({
          code: 'TREE_NOT_FOUND',
          message: '未找到指定的树结构',
          details: `ID "${id}" 对应的树结构不存在`,
        });
      }

      return tree;
    } catch (error) {
      // 如果已经是 HttpException，直接抛出
      if (error instanceof HttpException) {
        throw error;
      }

      // 处理其他错误
      throw new HttpException(
        {
          code: 'FETCH_TREE_FAILED',
          message: '获取树结构失败',
          details: error instanceof Error ? error.message : error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
