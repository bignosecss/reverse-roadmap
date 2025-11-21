"use client";

import { useState, useCallback } from "react";
import useSidebarStore from "@/lib/stores/sidebar";
import { RrRootStatus } from "@/lib/types/models";
import { toast } from "sonner";
import { useCheckSwitchMode } from "@/hooks/use-check-switch-mode";
import { SwitchModeDto } from "@/lib/types/apiRequests";

export function useSwitchModeDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const { mutate: checkSwitchMode, isPending } = useCheckSwitchMode();

  const mode = useSidebarStore((state) => state.mode);
  const toggleMode = useSidebarStore((state) => state.toggleMode);

  const resetForm = useCallback(() => {
    setPassword("");
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        const isPrivate = mode === RrRootStatus.private;
        setDialogTitle(isPrivate ? "切换到公开模式" : "输入密码");
        setDialogDescription(
          isPrivate ? "确定要切换到公开模式吗？" : "请输入密码以查看私有内容",
        );
      }
      setIsDialogOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm, mode],
  );

  const handleConfirm = useCallback(async () => {
    const closeDialogAndToggle = (newMode: RrRootStatus) => {
      handleOpenChange(false);
      setTimeout(() => {
        toggleMode(newMode);
        toast.success(`已切换到 ${newMode} 模式`);
      }, 150);
    };

    if (mode === RrRootStatus.private) {
      closeDialogAndToggle(RrRootStatus.public);
      return;
    }

    if (mode === RrRootStatus.public) {
      checkSwitchMode({ password: password } as SwitchModeDto, {
        onSuccess: () => {
          closeDialogAndToggle(RrRootStatus.private);
        },
        onError: (error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("网络请求失败，请稍后重试");
          }
        },
      });
    }
  }, [mode, handleOpenChange, toggleMode, checkSwitchMode, password]);

  const isFormValid =
    mode === RrRootStatus.private || (password.trim().length > 0 && !isPending);

  return {
    isDialogOpen,
    handleOpenChange,
    password,
    setPassword,
    handleConfirm,
    isFormValid,
    mode,
    dialogTitle,
    dialogDescription,
    isSubmitting: isPending,
  };
}
