"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { useCreate } from "@/hooks/use-rr-node";
import { CreateRrNodeDto } from "@/lib/types/apiRequests";
import { RrNode } from "@/lib/types/models";

interface UseAddNodeProps {
  currentNode: RrNode;
}

export function useAddNode({ currentNode }: UseAddNodeProps) {
  const pathname = usePathname();
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: addRrNode, isPending: isAddingNode } = useCreate();
  const queryClient = useQueryClient();

  const handleAddRrNode = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("请输入节点标题");
      return;
    }

    const trimmedDescription = description.trim();

    addRrNode(
      {
        title: trimmedTitle,
        description: trimmedDescription,
        parent: currentNode._id,
      } as CreateRrNodeDto,
      {
        onSuccess: (newNode: RrNode) => {
          setIsDialogOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["rrTree", currentTreeId],
          });
          toast.success("节点添加成功", {
            description: `新节点 "${newNode.title}" 已添加`,
          });
        },
        onError: (error: Error) => {
          setIsDialogOpen(false);
          toast.error("节点添加失败", {
            description: error?.message || "发生未知错误",
          });
        },
      },
    );
  }, [
    addRrNode,
    currentNode._id,
    currentTreeId,
    description,
    queryClient,
    title,
  ]);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
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
    handleAddRrNode,
    isAddingNode,
    isConfirmDisabled: title.trim().length === 0,
  };
}
