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

  const { mutate: updateRrRoot, isPending } = useUpdateRrRoot(rrRoot._id);
  const queryClient = useQueryClient();

  const resetForm = useCallback(() => {
    setTitle(rrRoot.title);
    setStatus(rrRoot.status);
  }, [rrRoot]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm],
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
    };

    updateRrRoot(data, {
      onSuccess: (updatedRrRoot: RrRoot) => {
        handleOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
        queryClient.invalidateQueries({ queryKey: ["publicRrRoots"] });
        queryClient.invalidateQueries({ queryKey: ["rrRoot", rrRoot._id] });
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
  }, [title, status, updateRrRoot, queryClient, handleOpenChange, rrRoot._id]);

  const isFormValid = title.trim().length > 0;

  return {
    isDialogOpen,
    handleOpenChange,
    title,
    setTitle,
    status,
    setStatus,
    handleConfirm,
    isFormValid,
    isPending,
  };
}
