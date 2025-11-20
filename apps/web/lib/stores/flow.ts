import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { FlowState, FlowNode, RrNode, FlowEdge } from "../types/models";

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
  addNode: (node: FlowNode, edge: FlowEdge) => {
    set((state) => ({
      nodes: [...state.nodes, node],
      edges: [...state.edges, edge],
    }));
  },
  updateNode: (rrNodeId: string, data: Partial<RrNode>) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.data.rrNode._id === rrNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                rrNode: {
                  ...node.data.rrNode,
                  ...data,
                },
              },
            }
          : node,
      ),
    }));
  },
  removeNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.target !== nodeId),
    }));
  },
  getNode: (rrNodeId: string) => {
    return get().nodes.find((node) => node.data.rrNode._id === rrNodeId);
  },
}));

export default useFlowStore;
