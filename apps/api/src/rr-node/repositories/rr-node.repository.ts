import { Injectable, NotFoundException } from '@nestjs/common';
import {
  RrNode,
  RrNodeDocument,
  RrNodeStatus,
} from '../schemas/rr-node.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, Types, UpdateQuery } from 'mongoose';

export interface RrNodeTree {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  parent: Types.ObjectId | null;
  content: Types.ObjectId | null;
  status?: RrNodeStatus;
  children: RrNodeTree[];
}

@Injectable()
export class RrNodeRepository {
  constructor(@InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>) {}

  save(rrNodeEntity: RrNodeDocument) {
    return rrNodeEntity.save();
  }

  create(rrNodeEntity: Partial<RrNode>) {
    return new this.rrNodeModel(rrNodeEntity);
  }

  findById(id: string) {
    return this.rrNodeModel.findById(id).exec();
  }

  findByIds(ids: string[]) {
    return this.rrNodeModel.find({ _id: { $in: ids } }).exec();
  }

  async findTreeById(id: string): Promise<RrNodeTree | null> {
    const nodes: RrNodeTree[] = await this.rrNodeModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $graphLookup: {
          from: 'rr_nodes',
          startWith: '$_id',
          connectFromField: 'children',
          connectToField: '_id',
          as: 'descendants',
        },
      },
      {
        $project: {
          allNodes: {
            $concatArrays: [
              [
                {
                  _id: '$_id',
                  title: '$title',
                  description: '$description',
                  parent: '$parent',
                  content: '$content',
                  children: '$children',
                  status: '$status',
                },
              ],
              '$descendants',
            ],
          },
        },
      },
      { $unwind: '$allNodes' },
      { $replaceRoot: { newRoot: '$allNodes' } },
    ]);

    if (!nodes.length) {
      return null;
    }

    const nodesById = new Map(nodes.map((node) => [node._id.toString(), node]));

    nodes.forEach((node) => {
      if (node.children && Array.isArray(node.children)) {
        node.children = node.children
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          .map((childId) => nodesById.get(childId.toString()))
          .filter(Boolean) as RrNodeTree[];
      }
    });

    return nodes.find((node) => node._id.toString() === id) || null;
  }

  async update(id: string, updateQuery: UpdateQuery<RrNode>) {
    const existingRrNode = await this.rrNodeModel
      .findByIdAndUpdate(id, updateQuery, { new: true })
      .exec();
    if (!existingRrNode) {
      throw new NotFoundException(`RrNode with ID ${id} not found`);
    }
    return existingRrNode;
  }

  async removeNode(id: string) {
    const removedNode = await this.rrNodeModel.findByIdAndDelete(id).exec();
    if (!removedNode) {
      throw new NotFoundException(`RrNode with ID ${id} not found`);
    }
    return removedNode;
  }

  async findDescendantIds(nodeId: string): Promise<string[]> {
    const descendants: Array<{ descendantIds: Types.ObjectId[] }> =
      await this.rrNodeModel.aggregate([
        { $match: { _id: new Types.ObjectId(nodeId) } },
        {
          $graphLookup: {
            from: 'rr_nodes',
            startWith: '$_id',
            connectFromField: 'children',
            connectToField: '_id',
            as: 'descendants',
          },
        },
        { $project: { descendantIds: '$descendants._id' } },
      ]);

    const result = descendants[0];
    if (!result || !result.descendantIds) {
      return [];
    }

    return result.descendantIds.map((id) => id.toString());
  }

  async removeMany(ids: string[]): Promise<DeleteResult> {
    return this.rrNodeModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}
