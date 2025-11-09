import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RrNode } from '../rr-node/schemas/rr-node.schema';
import { RrContent } from '../rr-content/schemas/rr-content.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DataMigrationService {
  constructor(
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
    @InjectModel(RrContent.name) private rrContentModel: Model<RrContent>,
  ) {}

  async seedData() {
    // Implement seed data logic if needed
    return { message: 'Data seeding not implemented' };
  }

  async migrateOldData() {
    const oldNodesPath = path.join(
      __dirname,
      'reverse-roadmap.rr_nodes.json',
    );
    const oldContentsPath = path.join(
      __dirname,
      'reverse-roadmap.rr_contents.json',
    );

    const oldNodes = JSON.parse(fs.readFileSync(oldNodesPath, 'utf-8'));
    const oldContents = JSON.parse(fs.readFileSync(oldContentsPath, 'utf-8'));

    await this.rrNodeModel.deleteMany({});
    await this.rrContentModel.deleteMany({});

    const newContents = oldContents.map((content) => {
      return {
        _id: content._id.$oid,
        type: content.type,
        content: content.content,
        tabTitle: '', // Will be updated later
      };
    });

    await this.rrContentModel.insertMany(newContents);

    const newNodes = oldNodes.map((node) => {
      const contentId = node.content?.$oid;
      return {
        _id: node._id.$oid,
        title: node.title,
        description: node.description,
        parent: node.parent?.$oid || null,
        children: node.children.map((child) => child.$oid),
        content: contentId
          ? [{ rrContent: contentId, tabTitle: node.title }]
          : [],
      };
    });

    await this.rrNodeModel.insertMany(newNodes);

    // Update tabTitle in rr_contents
    for (const node of newNodes) {
      if (node.content.length > 0) {
        const contentId = node.content[0].rrContent;
        await this.rrContentModel.findByIdAndUpdate(contentId, {
          tabTitle: node.title,
        });
      }
    }

    return { message: 'Data migration successful' };
  }
}
