"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateNode } from "@/lib/service/rrNodeApi";
import type { RrNode } from "@/lib/types/models";

interface AddNodeDialogProps {
  /** 父节点信息，用于创建子节点 */
  parentNode?: RrNode;
  /** 根节点ID */
  rootId: string;
  /** 触发按钮的自定义内容 */
  trigger?: React.ReactNode;
  /** 对话框标题 */
  title?: string;
  /** 外部控制对话框开关状态 */
  open?: boolean;
  /** 外部控制对话框开关状态的回调 */
  onOpenChange?: (open: boolean) => void;
}

/**
 * 添加节点专用Dialog组件
 *
 * 功能特性：
 * - 支持添加根节点或子节点
 * - 表单验证和错误处理
 * - 自动关闭和状态重置
 * - TypeScript类型安全
 */
export function AddNodeDialog({
  parentNode,
  rootId,
  trigger,
  title,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: AddNodeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // 使用外部控制的open状态，如果没有则使用内部状态
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const { mutate: createNode, isPending } = useCreateNode();

  // 表单验证
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = "节点标题不能为空";
    } else if (formData.title.length > 100) {
      newErrors.title = "节点标题不能超过100个字符";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "节点描述不能超过500个字符";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (parentNode?._id && rootId) {
      createNode(
        {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          parentId: parentNode._id,
          rootId,
        },
        {
          onSuccess: (newNode) => {
            // 重置表单
            setFormData({ title: "", description: "" });
            setErrors({});
            setOpen(false);

            // 显示成功提示
            toast.success("节点创建成功", {
              description: `已成功创建节点「${newNode.title}」`,
            });

            console.log("节点创建成功:", newNode);
          },
          onError: (error) => {
            console.error("创建节点失败:", error);

            // 显示错误提示
            toast.error("节点创建失败", {
              description:
                error instanceof Error ? error.message : "请稍后重试",
            });
          },
        },
      );
    }
  };

  // 处理对话框关闭
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // 关闭时重置表单
      setFormData({ title: "", description: "" });
      setErrors({});
    }
  };

  // 默认触发按钮
  const defaultTrigger = (
    <Button size="sm" className="gap-1.5">
      <Plus className="size-3.5" />
      {parentNode ? "添加子节点" : "添加节点"}
    </Button>
  );

  // 默认标题
  const dialogTitle =
    title || (parentNode ? `为"${parentNode.title}"添加子节点` : "添加新节点");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* 只有在没有外部控制时才显示触发器 */}
      {externalOpen === undefined && (
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 节点标题 */}
          <div className="space-y-2">
            <Label htmlFor="node-title">节点标题 *</Label>
            <Input
              id="node-title"
              placeholder="请输入节点标题"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                // 清除标题错误
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              className={errors.title ? "border-destructive" : ""}
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* 节点描述 */}
          <div className="space-y-2">
            <Label htmlFor="node-description">节点描述</Label>
            <Textarea
              id="node-description"
              placeholder="请输入节点描述（可选）"
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
                // 清除描述错误
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              className={errors.description ? "border-destructive" : ""}
              disabled={isPending}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isPending || !formData.title.trim()}
            >
              {isPending ? "创建中..." : "创建节点"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// 导出类型定义供其他组件使用
export type { AddNodeDialogProps };
