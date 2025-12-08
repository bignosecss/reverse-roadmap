import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { FlowState } from "../types/models";

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  currentRrNode: null,
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
    set({
      edges: addEdge(connection, get().edges),
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
}));

export default useFlowStore;
