import { useCallback } from "react";
import { Connection, addEdge } from "@xyflow/react";
import { FlowNode, FlowEdge, UpdateConnectionDto } from "@repo/shared";
import { useUpdateConnection } from "@/hooks/use-rr-node";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useTreeId } from "@/hooks/use-tree-id";

interface UseFlowConnectionProps {
  edges: FlowEdge[];
  nodes: FlowNode[];
  setEdges: (edges: FlowEdge[]) => void;
  setNodes: (nodes: FlowNode[]) => void;
}

export const useFlowConnection = ({
  edges,
  nodes,
  setEdges,
  setNodes,
}: UseFlowConnectionProps) => {
  const currentTreeId = useTreeId();

  const { mutateAsync: updateConnectionAsync } = useUpdateConnection();
  const queryClient = useQueryClient();

  const onConnect = useCallback(
    async (connection: Connection) => {
      // Get the edges before filtering to identify which edge is being removed
      const currentEdges = edges;
      const edgeToRemove = currentEdges.find(
        (edge) => edge.target === connection.target,
      );

      // Update nodes' parent and children relationships
      const updatedNodes = [
        ...nodes.map((node) => ({
          ...node,
          data: { ...node.data, rrNode: { ...node.data.rrNode } },
        })),
      ];

      if (edgeToRemove) {
        // Remove the child from the old parent's children array
        const oldParentNode = updatedNodes.find(
          (node) => node.data.rrNode._id === edgeToRemove.source,
        );
        if (oldParentNode && oldParentNode.data.rrNode.children) {
          oldParentNode.data.rrNode.children =
            oldParentNode.data.rrNode.children.filter(
              (childId) => childId !== edgeToRemove.target,
            );
        }

        // Find and update the node that's changing parent (the target node)
        const targetNode = updatedNodes.find(
          (node) => node.data.rrNode._id === connection.target,
        );
        if (targetNode) {
          // Set new parent relationship
          targetNode.data.rrNode.parent = connection.source;
        }
      }

      // Add the child to the new parent's children array
      const newParentNode = updatedNodes.find(
        (node) => node.data.rrNode._id === connection.source,
      );
      if (newParentNode) {
        // Make sure the target node exists in the nodes array
        const targetNode = updatedNodes.find(
          (node) => node.data.rrNode._id === connection.target,
        );
        if (targetNode) {
          if (!newParentNode.data.rrNode.children) {
            // Initialize children array if it doesn't exist
            newParentNode.data.rrNode.children = [];
          }

          // Check if the child already exists in the parent's children to avoid duplicates
          const childExists = newParentNode.data.rrNode.children.some(
            (childId) => childId === connection.target,
          );
          if (!childExists) {
            // Add the child's ID to the parent's children array
            newParentNode.data.rrNode.children.push(connection.target);
          }
        }
      }

      // Update the edges and nodes in state
      setEdges(
        addEdge(
          connection,
          currentEdges.filter(
            (edge) =>
              // In a tree structure, each node (except root) typically has only one parent
              // So remove any existing incoming connection to the same target
              edge.target !== connection.target,
          ),
        ),
      );
      setNodes(updatedNodes);

      try {
        await updateConnectionAsync({
          nodes: updatedNodes,
        } as UpdateConnectionDto);

        toast.success("连接关系已更新");
      } catch (error) {
        // Revert the changes if the API call fails
        setEdges(currentEdges);
        setNodes(nodes);

        const errorMessage =
          error instanceof Error ? error.message : "更新连接关系失败，请重试";
        toast.error(errorMessage);
      } finally {
        queryClient.invalidateQueries({
          queryKey: ["rrTree", currentTreeId],
        });
      }
    },
    [
      currentTreeId,
      edges,
      nodes,
      queryClient,
      setEdges,
      setNodes,
      updateConnectionAsync,
    ],
  );

  return { onConnect };
};
