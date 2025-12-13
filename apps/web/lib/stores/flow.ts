import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { FlowState } from "../types/models";
import { UpdateRrNodeDto } from "@repo/shared/dto";

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  currentRrNode: null,
  deletingFlowData: null,
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    // Get the edges before filtering to identify which edge is being removed
    const currentEdges = get().edges;
    const edgeToRemove = currentEdges.find(edge => edge.target === connection.target);

    // Update nodes' parent and children relationships
    const updatedNodes = [...get().nodes.map(node => ({...node, data: {...node.data, rrNode: {...node.data.rrNode}}}))];

    if (edgeToRemove) {
      // Remove the child from the old parent's children array
      const oldParentNode = updatedNodes.find(node => node.id === edgeToRemove.source);
      if (oldParentNode && oldParentNode.data.rrNode.children) {
        oldParentNode.data.rrNode.children = oldParentNode.data.rrNode.children.filter(
          (child) => child._id !== edgeToRemove.target
        );
      }

      // Find and update the node that's changing parent (the target node)
      const targetNode = updatedNodes.find(node => node.id === connection.target);
      if (targetNode) {
        // Set new parent relationship
        targetNode.data.rrNode.parent = connection.source;
      }
    }

    // Add the child to the new parent's children array
    const newParentNode = updatedNodes.find(node => node.id === connection.source);
    if (newParentNode) {
      // Make sure the target node exists in the nodes array
      const targetNode = updatedNodes.find(node => node.id === connection.target);
      if (targetNode) {
        if (!newParentNode.data.rrNode.children) {
          // Initialize children array if it doesn't exist
          newParentNode.data.rrNode.children = [];
        }

        // Check if the child already exists in the parent's children to avoid duplicates
        const childExists = newParentNode.data.rrNode.children.some((child) => child._id === connection.target);
        if (!childExists) {
          // Add the child node data to the parent's children array
          // Create a new object to avoid circular reference issues
          const childNodeForParent = {
            ...targetNode.data.rrNode,
            parent: newParentNode.id, // Update parent reference
            children: targetNode.data.rrNode.children // Preserve existing children
          };
          newParentNode.data.rrNode.children.push(childNodeForParent);
        }
      }
    }

    set({
      nodes: updatedNodes,
      edges: addEdge(
        connection,
        currentEdges.filter(
          (edge) =>
            // In a tree structure, each node (except root) typically has only one parent
            // So remove any existing incoming connection to the same target
            edge.target !== connection.target
        ),
      ),
    });
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  setCurrentRrNode: (node) => {
    set({ currentRrNode: node });
  },
  getNode: (rrNodeId: string) => {
    return get().nodes.find((node) => node.data.rrNode._id === rrNodeId);
  },
  updateNode: (id: string, updateRrNodeDto: UpdateRrNodeDto) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.data.rrNode._id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              rrNode: {
                ...node.data.rrNode,
                ...updateRrNodeDto,
              },
            },
          };
        }
        return node;
      }),
    });
  },
  setDeletingFlowData: (fd) => {
    set({ deletingFlowData: fd });
  },
}));

export default useFlowStore;
