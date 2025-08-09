import { Model, Types } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RrTree } from 'src/schemas/rr-tree.schema';

@Injectable()
export class RrTreeService {
  constructor(@InjectModel(RrTree.name) private rrTreeModel: Model<RrTree>) {}

  /**
   * 根据ID查找树结构
   * @param id - 字符串格式的ID
   * @returns Promise<RrTree> - 树结构数据
   * @throws BadRequestException - 当ID格式无效时
   * @throws NotFoundException - 当树结构不存在时
   * @throws InternalServerErrorException - 当数据库操作失败时
   */
  async findOne(id: string): Promise<RrTree> {
    try {
      // 验证 ObjectId 格式
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException({
          code: 'INVALID_OBJECT_ID',
          message: '无效的 ID 格式',
          details: `提供的 ID "${id}" 不是有效的 MongoDB ObjectId`,
        });
      }

      const objectId = new Types.ObjectId(id);
      const tree = await this.rrTreeModel.findOne({ rootId: objectId }).exec();

      if (!tree) {
        throw new NotFoundException({
          code: 'TREE_NOT_FOUND',
          message: '未找到指定的树结构',
          details: `ID "${id}" 对应的树结构不存在`,
        });
      }

      return tree;
    } catch (error) {
      // 如果已经是 NestJS 异常，直接抛出
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // 处理其他数据库错误
      throw new InternalServerErrorException({
        code: 'FETCH_TREE_FAILED',
        message: '获取树结构失败',
        details: error instanceof Error ? error.message : error,
      });
    }
  }
}
