import { FlowData, FlowNode, FlowEdge } from "../types/flow/flow-types";
import { RrNode } from "../types/models";

export function convertToFlow(flatRrNodes: RrNode[]): FlowData {
  // Create flow nodes from flat rr nodes
  const nodes: FlowNode[] = flatRrNodes.map((node) => ({
    id: node._id,
    type: "rrNode",
    position: { x: 0, y: 0 }, // Position will be determined by layout algorithm
    data: {
      label: node.title, // React Flow requires a label property
      rrNode: node,
    },
  }));

  // Create edges based on parent-child relationships
  const edges: FlowEdge[] = [];
  flatRrNodes.forEach((node) => {
    if (node.parent) {
      // Create an edge from the parent to this node
      edges.push({
        id: `${node.parent}-${node._id}`,
        source: node.parent,
        target: node._id,
        type: "smoothstep",
      });
    }
  });

  return { nodes, edges };
}
