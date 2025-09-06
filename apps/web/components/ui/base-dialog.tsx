"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * 基础Dialog组件 - 只负责UI展示和基本交互
 * 遵循"一个组件只做一件事"的原则
 */
interface BaseDialogProps {
  /** 是否打开 */
  open: boolean;
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void;
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认按钮样式 */
  confirmVariant?: "default" | "destructive";
  /** 确认回调 */
  onConfirm: () => void;
  /** 取消回调 */
  onCancel?: () => void;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 是否禁用确认按钮 */
  confirmDisabled?: boolean;
  /** 子内容 */
  children?: React.ReactNode;
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  confirmVariant = "default",
  onConfirm,
  onCancel,
  showCancel = true,
  confirmDisabled = false,
  children,
}: BaseDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        <DialogFooter>
          {showCancel && (
            <Button variant="outline" onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={confirmDisabled}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
