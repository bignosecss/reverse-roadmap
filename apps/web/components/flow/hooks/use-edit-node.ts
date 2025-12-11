"use client";

import { useCallback, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { useUpdateRrNodeById } from "@/hooks/use-rr-node";
import { useQueryClient } from "@tanstack/react-query";
import { RrNode, RrNodeStatus } from "@repo/shared/models";
import { UpdateRrNodeDto } from "@repo/shared/dto";

interface UseEditNodeProps {
  currentNode: RrNode;
}

export function useEditNode({ currentNode }: UseEditNodeProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState(currentNode.title);
  const [description, setDescription] = useState(currentNode.description || "");
  const [status, setStatus] = useState<RrNodeStatus>(
    currentNode.status || RrNodeStatus.Active,
  );

  const { mutate: updateRrNode, isPending: isUpdatingNode } =
    useUpdateRrNodeById(currentNode._id);

  useEffect(() => {
    if (isDialogOpen) {
      setTitle(currentNode.title);
      setDescription(currentNode.description || "");
      setStatus(currentNode.status || RrNodeStatus.Active);
    }
  }, [isDialogOpen, currentNode]);

  const handleEditRrNode = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("请输入节点标题");
      return;
    }

    const trimmedDescription = description.trim();

    updateRrNode(
      {
        title: trimmedTitle,
        description: trimmedDescription,
        status,
      } as UpdateRrNodeDto,
      {
        onSuccess: (updatedNode: RrNode) => {
          toast.success("节点更新成功", {
            description: `节点 "${updatedNode.title}" 已更新`,
          });
        },
        onError: (error: Error) => {
          toast.error("节点更新失败", {
            description: error?.message || "发生未知错误",
          });
        },
        onSettled: () => {
          setIsDialogOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["rrTree", currentTreeId],
          });
        },
      },
    );
  }, [title, description, updateRrNode, status, queryClient, currentTreeId]);

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
    handleEditRrNode,
    isUpdatingNode,
    isConfirmDisabled: title.trim().length === 0,
  };
}
