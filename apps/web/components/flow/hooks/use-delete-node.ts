"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRemoveRrNodeById } from "@/hooks/use-rr-node";
import { RrNode } from "@repo/shared/models";
import { FlowState } from "@/lib/types/models";
import { FlowData, FlowNode } from "@repo/shared";
import useFlowStore from "@/lib/stores/flow";
import { useShallow } from "zustand/react/shallow";
import { useTreeId } from "@/hooks/use-tree-id";

interface UseDeleteNodeProps {
  currentNode: RrNode;
}

const flowStoreSelector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  setDeletingFlowData: state.setDeletingFlowData,
});

export function useDeleteNode({ currentNode }: UseDeleteNodeProps) {
  const currentTreeId = useTreeId();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync: removeRrNodeAsync, isPending: isDeletingNode } =
    useRemoveRrNodeById(currentNode._id);
  const queryClient = useQueryClient();
  const { nodes, edges, setNodes, setEdges, setDeletingFlowData } =
    useFlowStore(useShallow(flowStoreSelector));

  const collectNodesToDelete = useCallback(
    (nodeId: string, allNodes: FlowNode[]): FlowNode[] => {
      const node = allNodes.find((n) => n.data.rrNode._id === nodeId);
      if (!node) return [];

      const nodesToDelete: FlowNode[] = [node];

      // Find children of the current node
      const children = allNodes.filter((n) => n.data.rrNode.parent === nodeId);
      for (const child of children) {
        nodesToDelete.push(
          ...collectNodesToDelete(child.data.rrNode._id, allNodes),
        );
      }

      return nodesToDelete;
    },
    [],
  );

  const handleDeleteRrNode = useCallback(async () => {
    // 直接关闭 dialog
    setIsDialogOpen(false);

    // Save nodes & edges copy for potential rollback
    const prevFlowData: FlowData = { nodes, edges };

    // Find nodes and edges to be removed
    // Nodes to remove: current selected node and its children nodes (if it has children)
    // Edges to remove: edges connected to these nodes
    const nodesToDelete = collectNodesToDelete(currentNode._id, nodes);
    const nodeIdsToDelete = nodesToDelete.map((n) => n.id);

    // Find edges to remove - those connected to nodes we're deleting
    const edgesToRemove = edges.filter(
      (edge) =>
        nodeIdsToDelete.includes(edge.source) ||
        nodeIdsToDelete.includes(edge.target),
    );
    const edgeIdsToRemove = edgesToRemove.map((edge) => edge.id);

    setDeletingFlowData({ nodes: nodesToDelete, edges: edgesToRemove });

    try {
      await removeRrNodeAsync(undefined);

      // Only update UI after successful API call
      const updatedNodes = nodes.filter(
        (node) => !nodeIdsToDelete.includes(node.id),
      );
      const updatedEdges = edges.filter(
        (edge) => !edgeIdsToRemove.includes(edge.id),
      );

      setNodes(updatedNodes);
      setEdges(updatedEdges);

      toast.success("节点删除成功", {
        description: `节点 "${currentNode.title}" 已被删除`,
      });
    } catch (error) {
      // Rollback to previous state if API call fails
      setNodes(prevFlowData.nodes);
      setEdges(prevFlowData.edges);
      setDeletingFlowData(null); // Clear the deleting state

      setIsDialogOpen(false);
      toast.error("节点删除失败", {
        description: error instanceof Error ? error.message : "发生未知错误",
      });
    } finally {
      // Invalidate queries to ensure fresh data from server
      queryClient.invalidateQueries({ queryKey: ["rrTree", currentTreeId] });
    }
  }, [
    nodes,
    edges,
    collectNodesToDelete,
    currentNode._id,
    currentNode.title,
    setDeletingFlowData,
    removeRrNodeAsync,
    queryClient,
    currentTreeId,
    setNodes,
    setEdges,
  ]);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return {
    isDialogOpen,
    handleOpenChange,
    handleDeleteRrNode,
    isDeletingNode,
  };
}
