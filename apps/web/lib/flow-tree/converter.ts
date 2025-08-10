import { FlowData, FlowEdge, FlowNode, RrNode, RrTree } from "../types/models";

/**
 * 将 RrTree 转换为 React Flow 数据格式
 */
export function convertTreeToFlow(rrTree: RrTree): FlowData {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  // 深度优先遍历，收集所有节点
  function traverseNode(node: RrNode, level: number, parentId?: string) {
    const nodeId = node._id.toString();

    // 创建 Flow 节点
    const flowNode: FlowNode = {
      id: nodeId,
      type: "rrNode",
      position: { x: 0, y: 0 }, // 稍后计算
      data: {
        label: node.title, // React Flow 需要的 label 属性
        rrNode: node,
        level,
      },
    };

    nodes.push(flowNode);

    // 创建父子连线
    if (parentId) {
      const edge: FlowEdge = {
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
      };
      edges.push(edge);
    }

    // 递归处理子节点
    if (node.children) {
      node.children.forEach((child) => {
        traverseNode(child, level + 1, nodeId);
      });
    }
  }

  // 从根节点开始遍历
  traverseNode(rrTree.rootNode, 0);

  return {
    nodes,
    edges,
  };
}
