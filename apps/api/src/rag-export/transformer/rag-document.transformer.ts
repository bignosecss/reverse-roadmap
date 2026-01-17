import { Injectable } from '@nestjs/common';
import { type RrNode, type RrContent, RrRootStatus } from '@repo/shared';
import type {
  RrRootDocument,
  RrNodeDocument,
  RrContentDocument,
} from '@repo/shared';
import type { FetchedData } from '../types';
import { HierarchyMapper } from '../utils/hierarchy.mapper';
import { StatusCounter } from '../utils/status.counter';
import { TipTapConverter } from '../utils/tiptap.converter';

@Injectable()
export class RagDocumentTransformer {
  constructor(
    private readonly hierarchyMapper: HierarchyMapper,
    private readonly statusCounter: StatusCounter,
    private readonly tipTapConverter: TipTapConverter,
  ) {}

  transformToRootDocument(
    data: FetchedData,
    statusCounts: ReturnType<StatusCounter['countByStatus']>,
  ): RrRootDocument {
    const { root, nodes } = data;

    // Count total tabs
    let totalTabs = 0;
    for (const node of nodes) {
      totalTabs += node.content.length;
    }

    return {
      id: root._id,
      title: root.title,
      rootRrNodeTitle: root.rootRrNode.title,

      metadata: {
        // Root node information
        rootRrNodeId: root.rootRrNode._id,
        rootRrNodeTitle: root.rootRrNode.title,
        rootRrNodeDescription: root.rootRrNode.description || '',
        rootRrNodeStatus: root.rootRrNode.status || 'active',

        // Root status
        rootStatus:
          root.status === RrRootStatus.public
            ? RrRootStatus.public
            : RrRootStatus.private,

        // Hierarchy structure information
        totalNodes: nodes.length,
        totalTabs,

        // Progress statistics
        completedNodesCount: statusCounts.completed,
        deprecatedNodesCount: statusCounts.deprecated,
        inProgressNodesCount: statusCounts.inProgress,
        notStartedNodesCount: statusCounts.notStarted,
        blockedNodesCount: statusCounts.blocked,
        reviwNodesCount: statusCounts.review,
        cancelledNodesCount: statusCounts.cancelled,
        activeNodesCount: statusCounts.active,

        // Time information
        createdAt: root.createdAt,
        updatedAt: root.updatedAt,
      },
    };
  }

  transformToNodeDocument(node: RrNode, data: FetchedData): RrNodeDocument {
    const hierarchy = this.hierarchyMapper.buildPath(node._id);
    const parentNodeTitle = this.hierarchyMapper.getParentTitle(node._id);
    const parentNodeId = this.hierarchyMapper.getParentId(node._id);
    const childrenTitles = this.hierarchyMapper.getChildrenTitles(node._id);
    const level = this.hierarchyMapper.getLevel(node._id);
    const childrenCount = this.hierarchyMapper.getChildrenCount(node._id);

    // Generate semantic title from hierarchy
    const title = hierarchy.length > 0 ? hierarchy.join(' > ') : node.title;

    return {
      id: node._id,
      title,
      description: node.description || '',
      parentNodeTitle: parentNodeTitle || '',
      tabTitles: node.content.map((c) => c.tabTitle),
      childrenTitles,

      metadata: {
        // Hierarchy information
        hierarchy,
        level,

        // Node properties
        nodeTitle: node.title,
        nodeDescription: node.description,
        nodeStatus: node.status || 'active',

        // Content properties
        tabTitles: node.content.map((c) => c.tabTitle),

        // Time information
        createdAt: node.createdAt || new Date(),
        updatedAt: node.updatedAt || new Date(),

        // Relationship information
        rrRootId: data.root._id,
        rrRootTitle: data.root.title,
        parentNodeId,
        parentNodeTitle,
        childrenCount,
        childrenTitles,
      },
    };
  }

  transformToContentDocument(
    content: RrContent,
    nodeId: string,
    node: RrNode,
    data: FetchedData,
  ): RrContentDocument {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const conversion = this.tipTapConverter.convertFull(content.content);

    return {
      id: content._id,
      rrRootTitle: data.root.title,
      nodeTitle: node.title,
      tabTitle: content.tabTitle,
      content: conversion.markdown,

      metadata: {
        // Content identification
        tabTitle: content.tabTitle,
        contentLength: conversion.contentLength,

        // Node relationship
        nodeId,
        nodeTitle: node.title,
        nodeDescription: node.description,
        nodeStatus: node.status || 'active',

        // Root relationship
        rrRootId: data.root._id,
        rrRootTitle: data.root.title,

        // Time information
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
      },
    };
  }

  transformAll(data: FetchedData): {
    rootDocument: RrRootDocument;
    nodeDocuments: RrNodeDocument[];
    contentDocuments: RrContentDocument[];
  } {
    // Build hierarchy
    this.hierarchyMapper.buildHierarchy(data.nodes);

    // Count by status
    const statusCounts = this.statusCounter.countByStatus(data.nodes);

    // Transform root document
    const rootDocument = this.transformToRootDocument(data, statusCounts);

    // Transform node documents
    const nodeDocuments: RrNodeDocument[] = [];
    for (const node of data.nodes) {
      const doc = this.transformToNodeDocument(node, data);
      nodeDocuments.push(doc);
    }

    // Transform content documents
    const contentDocuments: RrContentDocument[] = [];

    for (const content of data.contents) {
      // Find the node that contains this content
      for (const node of data.nodes) {
        const nodeContent = node.content.find(
          (c) => c.rrContent === content._id,
        );
        if (nodeContent) {
          const doc = this.transformToContentDocument(
            content,
            node._id,
            node,
            data,
          );
          contentDocuments.push(doc);
          break;
        }
      }
    }

    return {
      rootDocument,
      nodeDocuments,
      contentDocuments,
    };
  }
}
