import { Injectable, Logger } from '@nestjs/common';
import type {
  RrRootDocument,
  RrNodeDocument,
  RrContentDocument,
  SemanticRootDocument,
  SemanticNodeDocument,
  SemanticContentDocument,
  SemanticDocumentUnion,
} from '@repo/shared';

@Injectable()
export class SemanticDocumentTransformer {
  private readonly logger = new Logger(SemanticDocumentTransformer.name);

  /**
   * 将 RrRootDocument 转换为语义化文档
   */
  transformToSemanticRoot(doc: RrRootDocument): SemanticRootDocument {
    const lines: string[] = [];

    lines.push(`目标名称：${doc.title}`);
    lines.push(`根节点：${doc.rootRrNodeTitle}`);
    lines.push(`目标状态：${doc.metadata.rootStatus}`);
    lines.push('');

    // 根节点详情
    lines.push('根节点信息：');
    lines.push(`  节点名称：${doc.metadata.rootRrNodeTitle}`);
    if (doc.metadata.rootRrNodeDescription) {
      lines.push(`  节点描述：${doc.metadata.rootRrNodeDescription}`);
    }
    lines.push(`  节点状态：${doc.metadata.rootRrNodeStatus}`);
    lines.push('');

    // 层级结构信息
    lines.push('层级结构：');
    lines.push(`  节点总数：${doc.metadata.totalNodes}`);
    lines.push(`  内容标签总数：${doc.metadata.totalTabs}`);
    lines.push('');

    // 进度统计
    lines.push('进度统计：');
    lines.push(`  已完成：${doc.metadata.completedNodesCount}`);
    lines.push(`  进行中：${doc.metadata.inProgressNodesCount}`);
    lines.push(`  未开始：${doc.metadata.notStartedNodesCount}`);
    lines.push(`  活跃中：${doc.metadata.activeNodesCount}`);
    lines.push(`  已阻塞：${doc.metadata.blockedNodesCount}`);
    lines.push(`  审核中：${doc.metadata.reviewNodesCount}`);
    lines.push(`  已废弃：${doc.metadata.deprecatedNodesCount}`);
    lines.push(`  已取消：${doc.metadata.cancelledNodesCount}`);
    lines.push('');

    // 时间信息
    lines.push('时间信息：');
    lines.push(`  创建时间：${doc.metadata.createdAt.toISOString()}`);
    lines.push(`  更新时间：${doc.metadata.updatedAt.toISOString()}`);

    const content = lines.join('\n');

    return {
      type: 'root',
      id: doc.id,
      content,
      metadata: {
        rrRootId: doc.metadata.rootRrNodeId,
        rrRootTitle: doc.title,
        rootRrNodeId: doc.metadata.rootRrNodeId,
        rootRrNodeTitle: doc.metadata.rootRrNodeTitle,
        rootRrNodeDescription: doc.metadata.rootRrNodeDescription,
        rootRrNodeStatus: doc.metadata.rootRrNodeStatus,
        rootStatus: doc.metadata.rootStatus,
        isPublic: doc.metadata.isPublic,
        totalNodes: doc.metadata.totalNodes,
        totalTabs: doc.metadata.totalTabs,
        completedNodesCount: doc.metadata.completedNodesCount,
        deprecatedNodesCount: doc.metadata.deprecatedNodesCount,
        inProgressNodesCount: doc.metadata.inProgressNodesCount,
        notStartedNodesCount: doc.metadata.notStartedNodesCount,
        blockedNodesCount: doc.metadata.blockedNodesCount,
        reviewNodesCount: doc.metadata.reviewNodesCount,
        cancelledNodesCount: doc.metadata.cancelledNodesCount,
        activeNodesCount: doc.metadata.activeNodesCount,
        createdAt: doc.metadata.createdAt,
        updatedAt: doc.metadata.updatedAt,
      },
    };
  }

  /**
   * 将 RrNodeDocument 转换为语义化文档
   */
  transformToSemanticNode(doc: RrNodeDocument): SemanticNodeDocument {
    const lines: string[] = [];

    lines.push(`节点名称：${doc.title}`);
    lines.push(`所属目标：${doc.metadata.rrRootTitle}`);
    lines.push(`节点状态：${doc.metadata.nodeStatus}`);
    lines.push(`层级深度：${doc.metadata.level}`);
    lines.push('');

    // 节点描述
    if (doc.description) {
      lines.push('节点说明：');
      lines.push(doc.description);
      lines.push('');
    }

    // 层级路径
    if (doc.metadata.hierarchy.length > 0) {
      lines.push('层级路径：');
      lines.push(`  ${doc.metadata.hierarchy.join(' > ')}`);
      lines.push('');
    }

    // 父节点信息
    if (doc.parentNodeTitle) {
      lines.push('父节点：');
      lines.push(`  节点名称：${doc.parentNodeTitle}`);
      lines.push('');
    }

    // 子节点信息
    if (doc.childrenTitles.length > 0) {
      lines.push('子节点：');
      lines.push(`  子节点数量：${doc.childrenTitles.length}`);
      if (doc.childrenTitles.length <= 5) {
        doc.childrenTitles.forEach((child) => {
          lines.push(`  - ${child}`);
        });
      } else {
        doc.childrenTitles.slice(0, 5).forEach((child) => {
          lines.push(`  - ${child}`);
        });
        lines.push(`  ... 等共 ${doc.childrenTitles.length} 个子节点`);
      }
      lines.push('');
    }

    // 内容标签页
    if (doc.tabTitles.length > 0) {
      lines.push('内容标签页：');
      lines.push(`  标签页数量：${doc.tabTitles.length}`);
      doc.tabTitles.forEach((tab) => {
        lines.push(`  - ${tab}`);
      });
      lines.push('');
    }

    // 时间信息
    lines.push('时间信息：');
    lines.push(`  创建时间：${doc.metadata.createdAt.toISOString()}`);
    lines.push(`  更新时间：${doc.metadata.updatedAt.toISOString()}`);

    const content = lines.join('\n');

    return {
      type: 'node',
      id: doc.id,
      content,
      metadata: {
        nodeId: doc.id,
        nodeTitle: doc.metadata.nodeTitle,
        nodeDescription: doc.metadata.nodeDescription,
        nodeStatus: doc.metadata.nodeStatus,
        rrRootId: doc.metadata.rrRootId,
        rrRootTitle: doc.metadata.rrRootTitle,
        isPublic: doc.metadata.isPublic,
        hierarchy: doc.metadata.hierarchy,
        level: doc.metadata.level,
        parentNodeId: doc.metadata.parentNodeId,
        parentNodeTitle: doc.metadata.parentNodeTitle,
        childrenCount: doc.metadata.childrenCount,
        childrenTitles: doc.metadata.childrenTitles,
        tabTitles: doc.metadata.tabTitles,
        createdAt: doc.metadata.createdAt,
        updatedAt: doc.metadata.updatedAt,
      },
    };
  }

  /**
   * 将 RrContentDocument 转换为语义化文档
   *
   * 注意：content 字段只包含纯 markdown 内容（来自 TipTap → Markdown 转换）
   * 所有描述信息存储在 metadata 中，保持向量检索时只搜索用户实际内容
   */
  transformToSemanticContent(doc: RrContentDocument): SemanticContentDocument {
    return {
      type: 'content',
      id: doc.id,
      content: doc.content, // 直接使用 markdown 内容，不添加描述文本
      metadata: {
        contentId: doc.id,
        tabTitle: doc.tabTitle,
        contentLength: doc.metadata.contentLength,
        nodeId: doc.metadata.nodeId,
        nodeTitle: doc.nodeTitle,
        nodeDescription: doc.metadata.nodeDescription,
        nodeStatus: doc.metadata.nodeStatus,
        rrRootId: doc.metadata.rrRootId,
        rrRootTitle: doc.rrRootTitle,
        isPublic: doc.metadata.isPublic,
        createdAt: doc.metadata.createdAt,
        updatedAt: doc.metadata.updatedAt,
      },
    };
  }

  /**
   * 批量转换所有文档
   */
  transformAll(docs: {
    rootDocument: RrRootDocument;
    nodeDocuments: RrNodeDocument[];
    contentDocuments: RrContentDocument[];
  }): {
    semanticRoot: SemanticRootDocument;
    semanticNodes: SemanticNodeDocument[];
    semanticContents: SemanticContentDocument[];
    all: SemanticDocumentUnion[];
  } {
    this.logger.log('Transforming documents to semantic format');

    const semanticRoot = this.transformToSemanticRoot(docs.rootDocument);

    const semanticNodes = docs.nodeDocuments.map((doc) =>
      this.transformToSemanticNode(doc),
    );

    const semanticContents = docs.contentDocuments.map((doc) =>
      this.transformToSemanticContent(doc),
    );

    this.logger.log(
      `Transformed ${semanticNodes.length} nodes and ${semanticContents.length} contents`,
    );

    return {
      semanticRoot,
      semanticNodes,
      semanticContents,
      all: [semanticRoot, ...semanticNodes, ...semanticContents],
    };
  }
}
