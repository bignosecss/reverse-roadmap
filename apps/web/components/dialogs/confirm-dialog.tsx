"use client";

import React from "react";
import { BaseDialog } from "./base-dialog";

/**
 * 确认Dialog - 处理简单的确认操作
 * 用于删除确认、操作确认等场景
 */
interface ConfirmDialogProps {
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
  variant?: "default" | "destructive";
  /** 确认回调 */
  onConfirm: () => void;
  /** 取消回调 */
  onCancel?: () => void;
  /** 自定义内容 */
  children?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  variant = "default",
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={variant}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {children}
    </BaseDialog>
  );
}
