import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRrNodeDto } from './dto/create-rr-node.dto';
import { UpdateRrNodeDto } from './dto/update-rr-node.dto';
import { RrTreeService } from 'src/rr-tree/rr-tree.service';
import { ErrorHandlerService } from 'src/common/error-handler/error-handler.service';
import { RrNode } from 'src/schemas/rr-node.schema';

@Injectable()
export class RrNodeService {
  constructor(
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
    private readonly rrTreeService: RrTreeService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createRrNodeDto: CreateRrNodeDto) {
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
    rootNode: RrNode,
    parentId: Types.ObjectId,
    newNode: RrNode,
  ): boolean {
    if (parentId.equals(rootNode._id)) {
      if (rootNode.children === null) {
        rootNode.children = [];
      }
      rootNode.children.push(newNode);
      // 节点已成功添加
      return true;
    }

    if (!rootNode.children?.length) {
      return false;
    }

    for (const child of rootNode.children) {
      if (this.addNodeToTree(child, parentId, newNode)) {
        return true;
      }
    }

    return false;
  }

  findAll() {
    return `This action returns all rrNode`;
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

  update(id: number, updateRrNodeDto: UpdateRrNodeDto) {
    return `This action updates a #${id} rrNode`;
  }

  remove(id: number) {
    return `This action removes a #${id} rrNode`;
  }
}
