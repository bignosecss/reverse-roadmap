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
    set({
      edges: addEdge(
        connection,
        get().edges.filter(
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
