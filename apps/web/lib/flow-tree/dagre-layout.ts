import dagre from "@dagrejs/dagre";
import { Position } from "@xyflow/react";
import { FlowData, FlowEdge, FlowNode } from "../types/models";

const NODE_WIDTH = 240;
const NODE_HEIGHT = 142;
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export enum DagreDirection {
  TB = "TB",
  LR = "LR",
  BT = "BT",
  RL = "RL",
}

export const getLayoutedNodes = (
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: DagreDirection = DagreDirection.TB,
): FlowData => {
  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: 100, // 增加层级间距到 80 像素
    nodesep: 60, // 增加同层节点间距到 60 像素
    edgesep: 20, // 增加边间距到 20 像素
    marginx: 20, // 添加水平边距
    marginy: 20, // 添加垂直边距
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? NODE_WIDTH,
      height: node.measured?.height ?? NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode: FlowNode = {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - (node.measured?.width ?? 0) / 2,
        y: nodeWithPosition.y - (node.measured?.height ?? 0) / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};
