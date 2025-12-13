import { Injectable, NotFoundException } from '@nestjs/common';
import {
  RrNode as RrNodeModel,
  RrNodeDocument,
} from '../schemas/rr-node.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, Types, UpdateQuery } from 'mongoose';
import { RrNode } from '@repo/shared/models';

@Injectable()
export class RrNodeRepository {
  constructor(
    @InjectModel(RrNodeModel.name) private rrNodeModel: Model<RrNodeModel>,
  ) {}

  save(rrNodeEntity: RrNodeDocument) {
    return rrNodeEntity.save();
  }

  create(rrNodeEntity: Partial<RrNodeModel>) {
    return new this.rrNodeModel(rrNodeEntity);
  }

  findById(id: string) {
    return this.rrNodeModel.findById(id).exec();
  }

  findByIds(ids: string[]) {
    return this.rrNodeModel.find({ _id: { $in: ids } }).exec();
  }

  async findFlatRrNodes(id: string): Promise<RrNode[] | null> {
    const result: any[] = await this.rrNodeModel.aggregate([
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
              // Add the root node
              [
                {
                  _id: { $toString: '$_id' },
                  title: '$title',
                  description: '$description',
                  parent: {
                    $cond: {
                      if: { $eq: ['$parent', null] },
                      then: null,
                      else: { $toString: '$parent' },
                    },
                  },
                  content: '$content',
                  children: {
                    $map: {
                      input: '$children',
                      as: 'child',
                      in: { $toString: '$$child' },
                    },
                  },
                  status: '$status',
                  createdAt: '$createdAt',
                  updatedAt: '$updatedAt',
                },
              ],
              // Add the descendants
              {
                $map: {
                  input: '$descendants',
                  as: 'desc',
                  in: {
                    _id: { $toString: '$$desc._id' },
                    title: '$$desc.title',
                    description: '$$desc.description',
                    parent: {
                      $cond: {
                        if: { $eq: ['$$desc.parent', null] },
                        then: null,
                        else: { $toString: '$$desc.parent' },
                      },
                    },
                    content: '$$desc.content',
                    children: {
                      $map: {
                        input: '$$desc.children',
                        as: 'child',
                        in: { $toString: '$$child' },
                      },
                    },
                    status: '$$desc.status',
                    createdAt: '$$desc.createdAt',
                    updatedAt: '$$desc.updatedAt',
                  },
                },
              },
            ],
          },
        },
      },
      { $unwind: '$allNodes' },
      { $replaceRoot: { newRoot: '$allNodes' } },
      // Add group stage to remove duplicates
      {
        $group: {
          _id: '$_id',
          doc: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$doc' },
      },
    ]);

    return result as RrNode[];
  }

  async update(id: string, updateQuery: UpdateQuery<RrNodeModel>) {
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
