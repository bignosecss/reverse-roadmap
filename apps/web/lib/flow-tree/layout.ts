import { FlowNode } from "../types/models";

/**
 * 计算节点位置 - 层级布局算法
 */
export function calculateNodePositions(nodes: FlowNode[]): FlowNode[] {
  const LEVEL_HEIGHT = 150; // 垂直间距
  const NODE_SPACING = 200; // 节点间距
  const NODE_WIDTH = 150; // 节点宽度（估算值）

  // 按层级分组
  const nodesByLevel = new Map<number, FlowNode[]>();
  nodes.forEach((node) => {
    const level = node.data.level;
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
  });

  // 为每层计算位置 - 居中对齐
  nodesByLevel.forEach((levelNodes, level) => {
    if (levelNodes.length === 0) return;

    // 计算整层的总宽度：节点宽度 × 节点数 + 间距 × (节点数-1)
    const totalWidth =
      levelNodes.length * NODE_WIDTH + (levelNodes.length - 1) * NODE_SPACING;
    const startX = -totalWidth / 2 + NODE_WIDTH / 2; // 第一个节点的中心位置

    levelNodes.forEach((node, index) => {
      node.position = {
        x: startX + index * (NODE_WIDTH + NODE_SPACING),
        y: level * LEVEL_HEIGHT,
      };
    });
  });

  return nodes;
}
