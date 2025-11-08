import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RrRoot } from 'src/rr-root/schemas/rr-root.schema';
import { RrNode } from 'src/rr-node/schemas/rr-node.schema';
import { RrContent } from 'src/rr-content/schemas/rr-content.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DataMigrationService {
  constructor(
    @InjectModel(RrRoot.name) private rrRootModel: Model<RrRoot>,
    @InjectModel(RrNode.name) private rrNodeModel: Model<RrNode>,
    @InjectModel(RrContent.name) private rrContentModel: Model<RrContent>,
  ) {}

  async migrateFromOldData() {
    console.log('Starting data migration from old data files...');

    // Read old data files
    // 哈，实际上得我把这仨文件放到 dist 目录下面去
    const oldRootsPath = path.join(
      __dirname,
      '../old-data/reverse-roadmap.rr_roots.json',
    );
    const oldNodesPath = path.join(
      __dirname,
      '../old-data/reverse-roadmap.rr_nodes.json',
    );
    const oldContentsPath = path.join(
      __dirname,
      '../old-data/reverse-roadmap.rr_node_contents.json',
    );

    const oldRoots = JSON.parse(fs.readFileSync(oldRootsPath, 'utf8'));
    const oldNodes = JSON.parse(fs.readFileSync(oldNodesPath, 'utf8'));
    const oldContents = JSON.parse(fs.readFileSync(oldContentsPath, 'utf8'));

    console.log(
      `Found ${oldRoots.length} old roots, ${oldNodes.length} old nodes, ${oldContents.length} old contents`,
    );

    // Clear existing data to avoid conflicts
    await this.rrRootModel.deleteMany({});
    await this.rrNodeModel.deleteMany({});
    await this.rrContentModel.deleteMany({});

    // Create a map of old object IDs to new object IDs to handle references
    const idMap = new Map<string, string>();

    // First, create all content items
    console.log('Migrating content...');
    for (const oldContent of oldContents) {
      let contentValue = oldContent.content;

      // Ensure content is an array as per new schema
      if (!Array.isArray(contentValue)) {
        contentValue = [contentValue];
      }

      const newContent = new this.rrContentModel({
        _id: oldContent._id.$oid,
        type: oldContent.type,
        content: contentValue,
        createdAt: new Date(oldContent.createdAt.$date),
        updatedAt: new Date(oldContent.updatedAt.$date),
      });

      await newContent.save();
      idMap.set(oldContent._id.$oid, newContent._id.toString());
    }

    // Process nodes to flatten the nested structure
    const flatNodes = this.flattenNodes(oldNodes);

    // Create all nodes with proper parent-child relationships
    console.log('Migrating nodes...');
    for (const oldNode of flatNodes) {
      let parentId: string | null = null;
      if (oldNode.parentId) {
        parentId =
          typeof oldNode.parentId === 'object' && oldNode.parentId.$oid
            ? oldNode.parentId.$oid
            : oldNode.parentId;
      }

      let contentId: string | null = null;
      if (oldNode.content) {
        contentId =
          typeof oldNode.content === 'object' && oldNode.content.$oid
            ? oldNode.content.$oid
            : oldNode.content;
      }

      const newNode = new this.rrNodeModel({
        _id:
          typeof oldNode._id === 'object' && oldNode._id.$oid
            ? oldNode._id.$oid
            : oldNode._id,
        title: oldNode.title,
        description: oldNode.description,
        parent: parentId,
        content: contentId,
        children: [], // Will be populated later
        createdAt: new Date(oldNode.createdAt.$date),
        updatedAt: new Date(oldNode.updatedAt.$date),
      });

      await newNode.save();
      idMap.set(
        typeof oldNode._id === 'object' && oldNode._id.$oid
          ? oldNode._id.$oid
          : oldNode._id,
        newNode._id.toString(),
      );
    }

    // Update all nodes with their children relationships
    console.log('Updating parent-child relationships...');
    for (const oldNode of flatNodes) {
      const nodeId =
        typeof oldNode._id === 'object' && oldNode._id.$oid
          ? oldNode._id.$oid
          : oldNode._id;

      // Find all nodes that have this node as parent
      const childrenIds: string[] = [];
      for (const otherNode of flatNodes) {
        const otherNodeId =
          typeof otherNode._id === 'object' && otherNode._id.$oid
            ? otherNode._id.$oid
            : otherNode._id;
        const otherParentId = otherNode.parentId
          ? typeof otherNode.parentId === 'object' && otherNode.parentId.$oid
            ? otherNode.parentId.$oid
            : otherNode.parentId
          : null;

        if (otherParentId === nodeId) {
          const mappedId = idMap.get(otherNodeId);
          if (mappedId) {
            childrenIds.push(mappedId);
          }
        }
      }

      // Update the node with children
      const mappedNodeId = idMap.get(nodeId);
      if (mappedNodeId) {
        await this.rrNodeModel.updateOne(
          { _id: mappedNodeId },
          { $set: { children: childrenIds } },
        );
      }
    }

    // Create all roots
    console.log('Migrating roots...');
    for (const oldRoot of oldRoots) {
      const treeRootNodeId =
        typeof oldRoot.treeRootNodeId === 'object' &&
        oldRoot.treeRootNodeId.$oid
          ? oldRoot.treeRootNodeId.$oid
          : oldRoot.treeRootNodeId;

      const mappedRootNodeId = idMap.get(treeRootNodeId);

      if (mappedRootNodeId) {
        const newRoot = new this.rrRootModel({
          _id:
            typeof oldRoot._id === 'object' && oldRoot._id.$oid
              ? oldRoot._id.$oid
              : oldRoot._id,
          title: oldRoot.title,
          rootRrNode: mappedRootNodeId,
          status: oldRoot.status || 'active', // Default to 'active' if not specified
          createdAt: new Date(oldRoot.createdAt.$date),
          updatedAt: new Date(oldRoot.updatedAt.$date),
        });

        await newRoot.save();
      } else {
        console.warn(
          `Root node ${treeRootNodeId} not found for root ${oldRoot._id} with title ${oldRoot.title}`,
        );
      }
    }

    console.log('Data migration completed successfully!');

    // Return summary
    const rootsCount = await this.rrRootModel.countDocuments();
    const nodesCount = await this.rrNodeModel.countDocuments();
    const contentsCount = await this.rrContentModel.countDocuments();

    return {
      message: 'Migration completed successfully',
      migrated: {
        roots: rootsCount,
        nodes: nodesCount,
        contents: contentsCount,
      },
    };
  }

  // Helper method to flatten nested nodes structure to a flat list
  private flattenNodes(nodes: any[]): any[] {
    const flatList: any[] = [];

    for (const node of nodes) {
      // Add the current node to the flat list
      flatList.push(node);

      // Process children recursively
      if (node.children && Array.isArray(node.children)) {
        flatList.push(...this.flattenNodes(node.children));
      }
    }

    return flatList;
  }
}
