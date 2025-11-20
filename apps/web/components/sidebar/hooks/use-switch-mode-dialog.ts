"use client";

import { useState, useCallback } from "react";
import useSidebarStore from "@/lib/stores/sidebar";
import { RrRootStatus } from "@/lib/types/models";
import { toast } from "sonner";

export function useSwitchModeDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");

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

  /**
   * React 渲染行为中的一个典型微妙之处。
   * 在 toggleMode() 之前调用了 handleOpenChange(false)
   * 但是，看到的视觉故障是由 React 的状态更新批处理引起的。
   * 
   * 下面是事件发生的顺序：                                                              
      1.当 handleConfirm 运行时，它会在同一个函数中安排两次状态更新：
        setIsDialogOpen(false) 和 toggleMode()。                                                
      2.为了提高效率，React 会对这些更新进行批处理，然后只重新渲染组件一次，同时应用这两个新状态。
        同时应用两个新状态。                                            
      3.在这一次重新呈现中，isDialogOpen 为 false（因此对话框开始关闭
        动画），但模式也发生了变化。                                              
      4.由于对话框的内容取决于模式，因此在关闭动画结束之前，对话框中的表单将以新的模式值重新渲染。
        模式值重新渲染。这使得窗体看起来闪烁或变化。

    解决方法是将这两个操作分离开来：首先关闭对话框，只有在对话框的
    动画消失后，才更新模式。我们可以通过一个简短的 setTimeout 来做到这一点。
   */
  const handleConfirm = useCallback(() => {
    const closeDialogAndToggle = (newMode: RrRootStatus) => {
      handleOpenChange(false);
      setTimeout(() => {
        toggleMode(newMode);
        toast.success(`已切换到 ${newMode} 模式`);
      }, 150);
    };

    if (mode === RrRootStatus.private) {
      closeDialogAndToggle(RrRootStatus.public);
    } else if (mode === RrRootStatus.public && password === "123qwe") {
      closeDialogAndToggle(RrRootStatus.private);
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
    dialogTitle,
    dialogDescription,
  };
}
