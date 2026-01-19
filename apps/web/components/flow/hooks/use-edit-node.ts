"use client";

import { useCallback, useState, useEffect } from "react";
import { toast } from "sonner";

import { useUpdateRrNodeById } from "@/hooks/use-rr-node";
import { useQueryClient } from "@tanstack/react-query";
import { RrNode, RrNodeStatus } from "@repo/shared/models";
import { UpdateRrNodeDto } from "@repo/shared/dto";
import useFlowStore from "@/lib/stores/flow";
import { FlowState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { useTreeId } from "@/hooks/use-tree-id";

interface UseEditNodeProps {
  currentNode: RrNode;
}

const flowStoreSelector = (flowState: FlowState) => ({
  getNode: flowState.getNode,
  updateNode: flowState.updateNode,
});

export function useEditNode({ currentNode }: UseEditNodeProps) {
  const currentTreeId = useTreeId();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState(currentNode.title);
  const [description, setDescription] = useState(currentNode.description || "");
  const [status, setStatus] = useState<RrNodeStatus>(
    currentNode.status || RrNodeStatus.Active,
  );
  const [excludeFromRAG, setExcludeFromRAG] = useState(
    currentNode.excludeFromRAG || false,
  );

  const { mutateAsync: updateRrNodeAsync, isPending: isUpdatingNode } =
    useUpdateRrNodeById(currentNode._id);
  const { getNode, updateNode } = useFlowStore(useShallow(flowStoreSelector));

  useEffect(() => {
    if (isDialogOpen) {
      setTitle(currentNode.title);
      setDescription(currentNode.description || "");
      setStatus(currentNode.status || RrNodeStatus.Active);
      setExcludeFromRAG(currentNode.excludeFromRAG || false);
    }
  }, [isDialogOpen, currentNode]);

  const handleEditRrNode = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("请输入节点标题");
      return;
    }

    const trimmedDescription = description.trim();
    const updateRrNodeDto: UpdateRrNodeDto = {
      title: trimmedTitle,
      description: trimmedDescription,
      status,
      excludeFromRAG,
    };

    // Optimistic update - update the store immediately
    const previousRrNode = getNode(currentNode._id);

    // Store previous values for potential rollback
    const previousValues: UpdateRrNodeDto = {
      title: previousRrNode?.data.rrNode.title || "",
      description: previousRrNode?.data.rrNode.description || "",
      status: previousRrNode?.data.rrNode.status || RrNodeStatus.Active,
    };

    // Update zustand store optimistically
    updateNode(currentNode._id, updateRrNodeDto);

    try {
      const updatedNode = await updateRrNodeAsync(updateRrNodeDto);
      toast.success("节点更新成功", {
        description: `节点 "${updatedNode.title}" 已更新`,
      });
    } catch (error) {
      // Rollback on error
      updateNode(currentNode._id, previousValues);

      toast.error("节点更新失败", {
        description: error instanceof Error ? error.message : "发生未知错误",
      });
    } finally {
      setIsDialogOpen(false);
      // Invalidate queries to ensure fresh data from server
      queryClient.invalidateQueries({
        queryKey: ["rrTree", currentTreeId],
      });
    }
  }, [
    title,
    description,
    status,
    excludeFromRAG,
    getNode,
    currentNode._id,
    updateNode,
    updateRrNodeAsync,
    queryClient,
    currentTreeId,
  ]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
  }, []);

  return {
    isDialogOpen,
    handleOpenChange,
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    excludeFromRAG,
    setExcludeFromRAG,
    handleEditRrNode,
    isUpdatingNode,
    isConfirmDisabled: title.trim().length === 0,
  };
}
