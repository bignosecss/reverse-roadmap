"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useRemoveRrNodeById } from "@/hooks/use-rr-node";
import { RrNode } from "@repo/shared/models";

interface UseDeleteNodeProps {
  currentNode: RrNode;
}

export function useDeleteNode({ currentNode }: UseDeleteNodeProps) {
  const pathname = usePathname();
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: removeRrNode, isPending: isDeletingNode } =
    useRemoveRrNodeById(currentNode._id);
  const queryClient = useQueryClient();

  const handleDeleteRrNode = useCallback(() => {
    removeRrNode(undefined, {
      onSuccess: () => {
        setIsDialogOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["rrTree", currentTreeId],
        });
        toast.success("节点删除成功", {
          description: `节点 "${currentNode.title}" 已被删除`,
        });
      },
      onError: (error: Error) => {
        setIsDialogOpen(false);
        toast.error("节点删除失败", {
          description: error?.message || "发生未知错误",
        });
      },
    });
  }, [removeRrNode, currentTreeId, queryClient, currentNode.title]);

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
