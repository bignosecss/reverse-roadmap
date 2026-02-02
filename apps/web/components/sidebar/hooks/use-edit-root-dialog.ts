"use client";

import { useState, useCallback } from "react";
import { useUpdateRrRoot } from "@/hooks/use-rr-root";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RrRoot, RrRootStatus } from "@repo/shared/models";
import { UpdateRrRootDto } from "@repo/shared/dto";

export function useEditRootDialog(rrRoot: RrRoot) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState(rrRoot.title);
  const [status, setStatus] = useState<RrRootStatus>(rrRoot.status);
  const [isPublic, setIsPublic] = useState(rrRoot.isPublic ?? false);

  const { mutate: updateRrRoot, isPending } = useUpdateRrRoot(rrRoot._id);
  const queryClient = useQueryClient();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
    },

    // 更新不需要 resetForm
    [],
  );

  const handleConfirm = useCallback(() => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      alert("请输入目标标题");
      return;
    }

    const data: UpdateRrRootDto = {
      title: trimmedTitle,
      status,
      isPublic,
    };

    updateRrRoot(data, {
      onSuccess: (updatedRrRoot: RrRoot) => {
        handleOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
        toast.success("编辑目标成功", {
          description: `目标 "${updatedRrRoot.title}" 已更新`,
        });
      },
      onError: (err) => {
        toast.error("编辑目标失败", {
          description: `${err}`,
        });
      },
    });
  }, [title, status, isPublic, updateRrRoot, queryClient, handleOpenChange]);

  const isFormValid = title.trim().length > 0;

  return {
    isDialogOpen,
    handleOpenChange,
    title,
    setTitle,
    status,
    setStatus,
    isPublic,
    setIsPublic,
    handleConfirm,
    isFormValid,
    isPending,
  };
}
