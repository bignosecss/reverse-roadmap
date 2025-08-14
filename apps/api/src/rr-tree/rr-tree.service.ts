import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RrTree } from 'src/schemas/rr-tree.schema';
import { ErrorHandlerService } from 'src/common/error-handler/error-handler.service';

@Injectable()
export class RrTreeService {
  constructor(
    @InjectModel(RrTree.name) private rrTreeModel: Model<RrTree>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  /**
   * 根据ID查找树结构
   * @param id - 字符串格式的ID
   * @returns Promise<RrTree> - 树结构数据
   */
  async findOne(id: string): Promise<RrTree> {
    try {
      const tree = await this.rrTreeModel
        .findOne({ rootId: new Types.ObjectId(id) })
        .exec();

      if (!tree) {
        this.errorHandlerService.throwNotFound('树结构', id);
      }

      return tree;
    } catch (error) {
      this.errorHandlerService.handleDatabaseError(error, 'fetch_tree');
    }
  }

  /**
   * 保存树结构
   * @param id - 字符串格式的ID
   * @param tree - 树结构数据
   * @returns Promise<RrTree> - 保存后的树结构数据
   */
  async save(treeRootId: string, tree: RrTree): Promise<RrTree | null> {
    try {
      // 先查找文档
      const document = await this.rrTreeModel.findOne({
        rootId: new Types.ObjectId(treeRootId),
      });

      if (!document) {
        this.errorHandlerService.throwNotFound('树结构', treeRootId);
      }

      // 更新 rootNode
      document.rootNode = tree.rootNode;

      // 标记嵌套对象已修改
      document.markModified('rootNode');

      // 保存文档
      const result = await document.save();

      return result;
    } catch (error) {
      this.errorHandlerService.handleDatabaseError(error, 'save_tree');
    }
  }
}
