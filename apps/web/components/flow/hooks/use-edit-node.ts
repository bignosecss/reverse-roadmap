"use client";

import { useCallback, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { useUpdateRrNodeById } from "@/hooks/use-rr-node";
import { UpdateRrNodeDto } from "@/lib/types/apiRequests";
import { RrNode } from "@/lib/types/models";
import useFlowStore from "@/lib/stores/flow";
import { findRrNode } from "@/lib/utils";

interface UseEditNodeProps {
  currentNode: RrNode;
}

export function useEditNode({ currentNode }: UseEditNodeProps) {
  const pathname = usePathname();
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState(currentNode.title);
  const [description, setDescription] = useState(currentNode.description || "");

  const { mutate: updateRrNode, isPending: isUpdatingNode } =
    useUpdateRrNodeById(currentNode._id);
  const queryClient = useQueryClient();
  const getFlowNode = useFlowStore((state) => state.getNode);
  const updateFlowNode = useFlowStore((state) => state.updateNode);

  useEffect(() => {
    if (isDialogOpen) {
      setTitle(currentNode.title);
      setDescription(currentNode.description || "");
    }
  }, [isDialogOpen, currentNode.title, currentNode.description]);

  const handleEditRrNode = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("请输入节点标题");
      return;
    }

    const trimmedDescription = description.trim();

    const flowNodeToUpdate = getFlowNode(currentNode._id)!;
    const prevFlowNode = JSON.parse(JSON.stringify(flowNodeToUpdate));

    updateFlowNode(currentNode._id, {
      title: trimmedTitle,
      description: trimmedDescription,
    });

    updateRrNode(
      {
        title: trimmedTitle,
        description: trimmedDescription,
      } as UpdateRrNodeDto,
      {
        onSuccess: (updatedNode: RrNode) => {
          queryClient.setQueryData(
            ["rrTree", currentTreeId],
            (oldRrTree: RrNode) => {
              if (!oldRrTree) return oldRrTree;

              const updateNodeInData = (rrTree: RrNode): RrNode | undefined => {
                const targetRrNode = findRrNode(
                  rrTree,
                  (rrNode) => rrNode._id === updatedNode._id,
                );
                if (!targetRrNode) return;
                targetRrNode.title = updatedNode.title;
                targetRrNode.description = updatedNode.description;
                return rrTree;
              };

              return updateNodeInData(oldRrTree);
            },
          );
          toast.success("节点更新成功", {
            description: `节点 "${updatedNode.title}" 已更新`,
          });
        },
        onError: (error: Error) => {
          updateFlowNode(currentNode._id, {
            title: prevFlowNode.data.rrNode.title,
            description: prevFlowNode.data.rrNode.description,
          });
          toast.error("节点更新失败", {
            description: error?.message || "发生未知错误",
          });
        },
      },
    );
    setIsDialogOpen(false);
  }, [
    title,
    description,
    getFlowNode,
    currentNode._id,
    updateFlowNode,
    updateRrNode,
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
    handleEditRrNode,
    isUpdatingNode,
    isConfirmDisabled: title.trim().length === 0,
  };
}
