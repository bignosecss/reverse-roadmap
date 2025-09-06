"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { CreateRrRootDto } from "@/lib/types/apiRequests";

/**
 * 创建根节点Dialog - 专门处理创建根节点的业务逻辑
 * 只处理CreateRrRootDto类型，类型安全且职责单一
 */
interface CreateRootDialogProps {
  /** 是否打开 */
  open: boolean;
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void;
  /** 确认创建回调 */
  onConfirm: (data: CreateRrRootDto) => void;
  /** 取消回调 */
  onCancel?: () => void;
}

export function CreateRootDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: CreateRootDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 当dialog打开时重置表单
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
    }
  }, [open]);

  const handleConfirm = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // 简单验证
    if (!trimmedTitle) {
      alert("请输入目标标题");
      return;
    }

    // 构造数据
    const data: CreateRrRootDto = {
      title: trimmedTitle,
      description: trimmedDescription || undefined,
    };

    onConfirm(data);
  };

  const isFormValid = title.trim().length > 0;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="创建新目标"
      description="创建一个新的目标树"
      confirmText="创建"
      cancelText="取消"
      confirmVariant="default"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      confirmDisabled={!isFormValid}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="root-title">目标标题 *</Label>
          <Input
            id="root-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入目标标题"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="root-description">目标描述</Label>
          <Textarea
            id="root-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
            placeholder="请输入目标描述（可选）"
          />
        </div>
      </div>
    </BaseDialog>
  );
}
