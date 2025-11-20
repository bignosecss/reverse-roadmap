"use client";

import { useState, useCallback } from "react";
import useSidebarStore from "@/lib/stores/sidebar";
import { RrRootStatus } from "@/lib/types/models";
import { toast } from "sonner";

export function useSwitchModeDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");

  const mode = useSidebarStore((state) => state.mode);
  const toggleMode = useSidebarStore((state) => state.toggleMode);

  const resetForm = useCallback(() => {
    setPassword("");
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

  const handleConfirm = useCallback(() => {
    if (mode === RrRootStatus.private) {
      handleOpenChange(false);
      toggleMode(RrRootStatus.public);
      toast.success(`已切换到 ${RrRootStatus.public} 模式`);
    } else if (mode === RrRootStatus.public && password === "123qwe") {
      handleOpenChange(false);
      toggleMode(RrRootStatus.private);
      toast.success(`已切换到 ${RrRootStatus.private} 模式`);
    } else {
      toast.error("密码错误");
    }
  }, [mode, password, toggleMode, handleOpenChange]);

  // If mode is private, form is always valid for switching to public
  const isFormValid =
    mode === RrRootStatus.private || password.trim().length > 0;

  return {
    isDialogOpen,
    handleOpenChange,
    password,
    setPassword,
    handleConfirm,
    isFormValid,
    mode,
  };
}
