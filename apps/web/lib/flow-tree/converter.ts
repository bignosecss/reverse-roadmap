import { RrNode, FlowData, FlowNode, FlowEdge } from "../types/models";

/**
 * 将 RrNode 转换为 React Flow Node 类型格式
 * > rrTree 就是 RrNode 的树形结构，是跟节点的引用
 */
export function convertTreeToFlow(rrTree: RrNode): FlowData {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  // 深度优先遍历，收集所有节点
  function traverseNode(node: RrNode, parentId?: string) {
    if (node === null) return;

    // 创建 Flow 节点
    const flowNode: FlowNode = {
      id: node._id,
      type: "rrNode",
      position: { x: 0, y: 0 }, // 由 dagre 布局算法计算
      data: {
        label: node.title, // React Flow 需要的 label 属性
        rrNode: node,
      },
    };

    nodes.push(flowNode);

    // 创建父子连线
    if (parentId) {
      const edge: FlowEdge = {
        id: `${parentId}-${node._id}`,
        source: parentId,
        target: node._id,
        type: "smoothstep",
      };
      edges.push(edge);
    }

    // 递归处理子节点
    if (node.children) {
      node.children.forEach((child) => {
        traverseNode(child, node._id);
      });
    }
  }

  // 从根节点开始遍历
  traverseNode(rrTree);

  return { nodes, edges };
}
