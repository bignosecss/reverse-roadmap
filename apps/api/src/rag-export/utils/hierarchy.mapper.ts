import type { RrNode } from '@repo/shared';

interface TreeNode {
  node: RrNode;
  children: TreeNode[];
  level: number;
}

export class HierarchyMapper {
  private tree: Map<string, TreeNode> = new Map();
  private nodeMap: Map<string, RrNode> = new Map();

  buildHierarchy(flatNodes: RrNode[]): Map<string, TreeNode> {
    this.tree.clear();
    this.nodeMap.clear();

    // Build node lookup map
    for (const node of flatNodes) {
      this.nodeMap.set(node._id, node);
    }

    // Build tree structure
    // 第一遍：创建所有 TreeNode（不建立引用）
    for (const node of flatNodes) {
      const treeNode: TreeNode = {
        node,
        children: [],
        level: 0,
      };
      this.tree.set(node._id, treeNode);
    }
    // 第二遍：建立父子引用并计算 level
    for (const node of flatNodes) {
      const treeNode = this.tree.get(node._id)!;

      if (node.parent) {
        const parentTreeNode = this.tree.get(node.parent);
        if (parentTreeNode) {
          parentTreeNode.children.push(treeNode);
        }
      }
    }

    this.calculateLevels();

    return this.tree;
  }
  private calculateLevels(): void {
    // 缓存已计算过的节点，避免重复递归
    const levelCache = new Map<string, number>();

    // Reverse Roadmap树结构不存在循环引用的情况
    const calculate = (nodeId: string): number => {
      // 如果缓存中有，直接返回
      if (levelCache.has(nodeId)) {
        return levelCache.get(nodeId)!;
      }

      const node = this.nodeMap.get(nodeId)!;
      if (!node.parent) {
        levelCache.set(nodeId, 0);
        return 0;
      }

      // 递归计算父节点 level
      const parentLevel = calculate(node.parent);
      const level = parentLevel + 1;
      levelCache.set(nodeId, level);
      return level;
    };

    // 为所有节点计算 level
    for (const [nodeId, treeNode] of this.tree) {
      if (!levelCache.has(nodeId)) {
        const level = calculate(nodeId);
        treeNode.level = level;
      } else {
        treeNode.level = levelCache.get(nodeId)!;
      }
    }
  }

  buildPath(nodeId: string): string[] {
    const path: string[] = [];
    let currentNodeId = nodeId;

    while (currentNodeId) {
      const node = this.nodeMap.get(currentNodeId);
      if (!node) break;

      path.unshift(node.title);
      currentNodeId = node.parent || '';
    }

    return path;
  }

  getParentTitle(nodeId: string): string | null {
    const node = this.nodeMap.get(nodeId);
    if (!node || !node.parent) return null;

    const parentNode = this.nodeMap.get(node.parent);
    return parentNode?.title || null;
  }

  getParentId(nodeId: string): string | null {
    const node = this.nodeMap.get(nodeId);
    return node?.parent || null;
  }

  getChildrenTitles(nodeId: string): string[] {
    const treeNode = this.tree.get(nodeId);
    if (!treeNode) return [];

    return treeNode.children.map((child) => child.node.title);
  }

  getChildrenCount(nodeId: string): number {
    const treeNode = this.tree.get(nodeId);
    return treeNode?.children.length || 0;
  }

  getLevel(nodeId: string): number {
    const treeNode = this.tree.get(nodeId);
    return treeNode?.level || 0;
  }

  getNodeMap(): Map<string, RrNode> {
    return this.nodeMap;
  }
}
