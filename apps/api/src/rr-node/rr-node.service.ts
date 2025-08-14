import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { RrTreeService } from 'src/rr-tree/rr-tree.service';
import { ErrorHandlerService } from 'src/common/error-handler/error-handler.service';
import { RrNode } from 'src/schemas/rr-node.schema';
import { DeleteNodeDto } from './dto/delete-rr-node.dto';

@Injectable()
export class RrNodeService {
  constructor(
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
    private readonly rrTreeService: RrTreeService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async createNode(createRrNodeDto: CreateRrNodeDto) {
    const tree = await this.rrTreeService.findOne(
      createRrNodeDto.rootId.toString(),
    );
    if (!tree) {
      this.errorHandlerService.throwNotFound(
        '树结构',
        createRrNodeDto.rootId.toString(),
      );
    }

    // 创建新节点并保存到数据库以生成 _id
    const newNode = new this.rrNodeModel({
      ...createRrNodeDto,
      _id: new Types.ObjectId(),
      children: null,
    });

    // 直接在原始树结构上添加节点
    const success = this.addNodeToTree(
      tree.rootNode,
      new Types.ObjectId(createRrNodeDto.parentId.toString()),
      newNode,
    );
    if (!success) {
      this.errorHandlerService.throwNotFound(
        '父节点',
        createRrNodeDto.parentId.toString(),
      );
    }

    await this.rrTreeService.save(tree.rootId.toString(), tree);

    return newNode;
  }
  private addNodeToTree(
    node: RrNode,
    parentId: Types.ObjectId,
    newNode: RrNode,
  ): boolean {
    if (parentId.equals(node._id)) {
      if (node.children === null) {
        node.children = [];
      }
      node.children.push(newNode);
      // 节点已成功添加
      return true;
    }

    if (!node.children?.length) {
      return false;
    }

    for (const child of node.children) {
      if (this.addNodeToTree(child, parentId, newNode)) {
        return true;
      }
    }

    return false;
  }

  async findOneNode(treeRootId: string, nodeId: string): Promise<RrNode> {
    const tree = await this.rrTreeService.findOne(treeRootId);
    const nodeObjectId = new Types.ObjectId(nodeId);

    const node = this.findNode(nodeObjectId, tree.rootNode);
    if (!node) {
      this.errorHandlerService.throwNotFound('节点', nodeId);
    }

    return node;
  }
  private findNode(nodeId: Types.ObjectId, node: RrNode): RrNode | null {
    if (nodeId.equals(node._id)) {
      return node;
    }

    if (!node.children?.length) {
      return null;
    }

    for (const child of node.children) {
      const foundNode = this.findNode(nodeId, child);
      if (foundNode) {
        return foundNode;
      }
    }

    return null;
  }

  async updateNode(updateRrNodeDto: UpdateRrNodeDto) {
    const tree = await this.rrTreeService.findOne(updateRrNodeDto.rootId);
    if (!tree) {
      this.errorHandlerService.throwNotFound('树结构', updateRrNodeDto.rootId);
    }

    const nodeObjectId = new Types.ObjectId(updateRrNodeDto.nodeId);

    const updatedNode = this.updateNodeInTree(tree.rootNode, nodeObjectId, updateRrNodeDto);
    if (!updatedNode) {
      this.errorHandlerService.throwNotFound('节点', updateRrNodeDto.nodeId);
    }

    await this.rrTreeService.save(tree.rootId.toString(), tree);

    return updatedNode;
  }
  private updateNodeInTree(
    node: RrNode,
    nodeId: Types.ObjectId,
    updateData: UpdateRrNodeDto,
  ): RrNode | null {
    if (nodeId.equals(node._id)) {
      const { title, description } = updateData;
      if (title !== undefined) node.title = title;
      if (description !== undefined) node.description = description;
      return node;
    }

    if (!node.children?.length) {
      return null;
    }

    for (const child of node.children) {
      const updatedChild = this.updateNodeInTree(child, nodeId, updateData);
      if (updatedChild) {
        return updatedChild;
      }
    }

    return null;
  }

  async removeNode(deleteNodeDto: DeleteNodeDto) {
    const tree = await this.rrTreeService.findOne(deleteNodeDto.rootId);
    if (!tree) {
      this.errorHandlerService.throwNotFound('树结构', deleteNodeDto.rootId);
    }

    const nodeObjectId = new Types.ObjectId(deleteNodeDto.nodeId);

    // 不能删除根节点
    if (nodeObjectId.equals(tree.rootNode._id)) {
      throw new Error('不能删除根节点');
    }

    const success = this.removeNodeFromTree(tree.rootNode, nodeObjectId);
    if (!success) {
      this.errorHandlerService.throwNotFound('节点', deleteNodeDto.nodeId);
    }

    await this.rrTreeService.save(tree.rootId.toString(), tree);
  }
  /**
   * 从树中递归删除指定节点及其所有子节点
   * @param node - 根节点
   * @param nodeIdToDelete - 要删除的节点ID
   * @returns boolean - 是否成功删除
   */
  private removeNodeFromTree(
    node: RrNode,
    nodeIdToDelete: Types.ObjectId,
  ): boolean {
    // 如果当前节点没有子节点，直接返回false
    if (!node.children?.length) {
      return false;
    }

    // 在直接子节点中查找要删除的节点
    const childIndex = node.children.findIndex((child) =>
      nodeIdToDelete.equals(child._id),
    );

    if (childIndex !== -1) {
      // 找到了要删除的节点，直接从数组中移除
      node.children.splice(childIndex, 1);

      // 如果删除后没有子节点了，将children设为null
      if (node.children.length === 0) {
        node.children = null;
      }

      return true;
    }

    // 在子节点中递归查找
    for (const child of node.children) {
      if (this.removeNodeFromTree(child, nodeIdToDelete)) {
        return true;
      }
    }

    return false;
  }
}
