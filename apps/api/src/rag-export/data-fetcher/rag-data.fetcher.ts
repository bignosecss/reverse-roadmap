import { Injectable } from '@nestjs/common';
import { RrRootService } from '../../rr-root/rr-root.service';
import { RrNodeService } from '../../rr-node/rr-node.service';
import { RrContentService } from '../../rr-content/rr-content.service';
import type { FetchedData } from '../types';
import { RrContent, RrNode, RrRoot } from '@repo/shared';

@Injectable()
export class RagDataFetcher {
  constructor(
    private readonly rrRootService: RrRootService,
    private readonly rrNodeService: RrNodeService,
    private readonly rrContentService: RrContentService,
  ) {}

  async fetchRootData(rootId: string): Promise<FetchedData['root']> {
    const root = await this.rrRootService.findOne(rootId);
    const rootRrNodeId = String(root.rootRrNode);
    const rootRrNode = await this.rrNodeService.findNode(rootRrNodeId);

    if (!rootRrNode) {
      throw new Error(`Root node with id ${rootRrNodeId} not found`);
    }

    return {
      ...(root as unknown as RrRoot),
      rootRrNode:
        rootRrNode as unknown as RrNode as FetchedData['root']['rootRrNode'],
    };
  }

  async fetchAllNodes(rootRrNodeId: string): Promise<FetchedData['nodes']> {
    // Use the service method to fetch all nodes in the tree
    const nodes = await this.rrNodeService.getAllNodesInTree(rootRrNodeId);

    if (!nodes) {
      return [];
    }

    return nodes;
  }

  async fetchAllContent(
    contentIds: string[],
  ): Promise<FetchedData['contents']> {
    if (contentIds.length === 0) {
      return [];
    }

    // Use findMany to batch fetch all content
    const results = await this.rrContentService.findMany(contentIds);

    // Map Mongoose documents to plain objects
    return (results as unknown as RrContent[]).map((doc: RrContent) => ({
      _id: String(doc._id),
      tabTitle: doc.tabTitle,
      type: doc.type,
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })) as FetchedData['contents'];
  }

  async fetchAll(rootId: string): Promise<FetchedData> {
    const rootData = await this.fetchRootData(rootId);
    const nodes = await this.fetchAllNodes(String(rootData.rootRrNode._id));

    // Collect all content IDs from all nodes
    const contentIds = new Set<string>();
    for (const node of nodes) {
      for (const nodeContent of node.content) {
        contentIds.add(String(nodeContent.rrContent));
      }
    }

    const contents = await this.fetchAllContent(Array.from(contentIds));

    return {
      root: rootData,
      nodes,
      contents,
    };
  }
}
