"use client";

import { useState, useCallback } from "react";
import { useCreateRrRoot } from "@/hooks/use-rr-root";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RrRoot, RrRootStatus } from "@repo/shared/models";
import { CreateRrRootDto } from "@repo/shared/dto";

export function useCreateRootDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<RrRootStatus>(RrRootStatus.private);

  const { mutate: createRrRoot, isPending } = useCreateRrRoot();
  const router = useRouter();
  const queryClient = useQueryClient();

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setStatus(RrRootStatus.private);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm],
  );

  const handleCreateRoot = useCallback(
    (data: CreateRrRootDto) => {
      createRrRoot(data, {
        onSuccess: (newRrRoot: RrRoot) => {
          handleOpenChange(false); // Close dialog and reset form
          queryClient.invalidateQueries({ queryKey: ["publicRrRoots"] });
          queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
          toast.success("创建新目标成功", {
            description: `新目标 "${newRrRoot.title}" 已创建`,
          });
          router.push(`/g/${newRrRoot.rootRrNode}`);
        },
        onError: (err) => {
          toast.error("创建新目标失败", {
            description: `${err}`,
          });
        },
      });
    },
    [createRrRoot, queryClient, router, handleOpenChange],
  );

  const handleConfirm = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      // This could be a toast notification as well
      alert("请输入目标标题");
      return;
    }

    const data: CreateRrRootDto = {
      title: trimmedTitle,
      description: trimmedDescription || undefined,
      status,
    };

    handleCreateRoot(data);
  }, [description, handleCreateRoot, title, status]);

  const isFormValid = title.trim().length > 0;

  return {
    isDialogOpen,
    handleOpenChange,
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    handleConfirm,
    isFormValid,
    isPending,
  };
}
