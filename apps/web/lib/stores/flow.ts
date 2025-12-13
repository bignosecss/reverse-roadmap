import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
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
  onConnect: () => {
    // This will be handled by the custom hook in the component
    // This function is kept for type compatibility but won't be used directly
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
