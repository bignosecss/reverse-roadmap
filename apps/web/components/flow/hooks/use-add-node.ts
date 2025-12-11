"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { useCreate } from "@/hooks/use-rr-node";
import { RrNode, RrNodeStatus } from "@repo/shared/models";
import { CreateRrNodeDto } from "@repo/shared/dto";
import { FlowState } from "@/lib/types/models";
import useFlowStore from "@/lib/stores/flow";
import { useShallow } from "zustand/react/shallow";
import { FlowEdge, FlowNode } from "@repo/shared";

interface UseAddNodeProps {
  currentNode: RrNode;
}

const flowStoreSelector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
});

export function useAddNode({ currentNode }: UseAddNodeProps) {
  const pathname = usePathname();
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<RrNodeStatus>(RrNodeStatus.Active);

  const { mutateAsync: addRrNodeAsync, isPending: isAddingNode } = useCreate();
  const queryClient = useQueryClient();
  const { nodes, edges, setNodes, setEdges } = useFlowStore(
    useShallow(flowStoreSelector),
  );

  const handleAddRrNode = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("请输入节点标题");
      return;
    }

    const trimmedDescription = description.trim();

    const addRrNodeDto: CreateRrNodeDto = {
      title: trimmedTitle,
      description: trimmedDescription,
      parent: currentNode._id,
      status,
    };

    // Find the FlowNode corresponding to the RrNode to get position info
    const parentFlowNode = nodes.find(
      (node) => node.data.rrNode._id === currentNode._id,
    );

    // Optimistic update - add the new node and edge to the flow store
    const optimisticId = `optimistic-${Date.now()}`;
    const newOptimisticNodeId = `node-${optimisticId}`;

    // Calculate position for the new node (position it to the right of the parent node)
    const parentNodePosition = parentFlowNode?.position || { x: 0, y: 0 };

    // Find siblings to determine vertical spacing
    const siblings = nodes.filter(
      (node) => node.data.rrNode.parent === currentNode._id,
    );
    const siblingCount = siblings.length;

    // Calculate position considering siblings to avoid overlapping
    const verticalOffset = siblingCount * 100; // Space out vertically by 100px per sibling
    const newPosition = {
      x: parentNodePosition.x + 300, // Position to the right of parent
      y: parentNodePosition.y + verticalOffset, // Offset vertically to avoid overlap
    };

    // Create optimistic node
    const optimisticNode: FlowNode = {
      id: newOptimisticNodeId,
      type: "rrNode",
      position: newPosition,
      data: {
        label: addRrNodeDto.title,
        rrNode: {
          ...addRrNodeDto,
          _id: optimisticId,
          parent: currentNode._id,
          content: [],
          children: [],
        },
      },
    };

    // Create optimistic edge from parent to new node
    const optimisticEdge: FlowEdge = {
      id: `edge-${currentNode._id}-${optimisticId}`,
      source: parentFlowNode?.id || currentNode._id,
      target: newOptimisticNodeId,
      animated: true,
      type: "smoothstep", // Using smoothstep edge for better visual
    };

    setNodes([...nodes, optimisticNode]);
    setEdges([...edges, optimisticEdge]);

    try {
      // Send the actual request
      const newNode: RrNode = await addRrNodeAsync(addRrNodeDto);

      setIsDialogOpen(false);
      toast.success("节点添加成功", {
        description: `新节点 "${newNode.title}" 已添加`,
      });
    } catch (error: unknown) {
      // Rollback the optimistic update if the request failed
      setNodes(nodes);
      setEdges(edges);

      setIsDialogOpen(false);
      const errorMessage =
        error instanceof Error ? error.message : "发生未知错误";
      toast.error("节点添加失败", {
        description: errorMessage,
      });
    } finally {
      queryClient.invalidateQueries({ queryKey: ["rrTree", currentTreeId] });
    }
  }, [
    title,
    description,
    currentNode._id,
    status,
    nodes,
    setNodes,
    setEdges,
    edges,
    addRrNodeAsync,
    queryClient,
    currentTreeId,
  ]);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setStatus(RrNodeStatus.Active);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    },
    [resetForm],
  );

  return {
    isDialogOpen,
    handleOpenChange,
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    handleAddRrNode,
    isAddingNode,
    isConfirmDisabled: title.trim().length === 0,
  };
}
