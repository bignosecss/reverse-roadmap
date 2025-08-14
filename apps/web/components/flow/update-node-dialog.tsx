"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUpdateNode } from "@/lib/service/rrNodeApi";
import type { RrNode } from "@/lib/types/models";

interface UpdateNodeDialogProps {
  /** 节点信息，用于更新节点 */
  node?: RrNode;
  /** 根节点ID */
  rootId: string;
  /** 外部控制对话框开关状态 */
  open: boolean;
  /** 外部控制对话框开关状态的回调 */
  onOpenChange: (open: boolean) => void;
}

/**
 * 更新节点专用Dialog组件
 *
 * 功能特性：
 * - 支持更新节点标题和描述
 * - 表单验证和错误处理
 * - 自动关闭和状态重置
 * - TypeScript类型安全
 */
export function UpdateNodeDialog({
  node,
  rootId,
  open,
  onOpenChange,
}: UpdateNodeDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const { mutate: updateNode, isPending } = useUpdateNode();

  // 当节点数据变化时，更新表单数据
  useEffect(() => {
    if (node && open) {
      setFormData({
        title: node.title || "",
        description: node.description || "",
      });
    }
  }, [node, open]);

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

    if (node?._id && rootId) {
      updateNode(
        {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          nodeId: node._id,
          rootId,
        },
        {
          onSuccess: (updatedNode: RrNode) => {
            // 重置表单
            setFormData({ title: "", description: "" });
            setErrors({});
            onOpenChange(false);

            // 显示成功提示
            toast.success("节点更新成功", {
              description: `已成功更新节点「${updatedNode.title}」`,
            });

            console.log("节点更新成功:", updatedNode);
          },
          onError: (error: Error) => {
            console.error("更新节点失败:", error);

            // 显示错误提示
            toast.error("节点更新失败", {
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
    onOpenChange(newOpen);
    if (!newOpen) {
      // 关闭时重置表单
      setFormData({ title: "", description: "" });
      setErrors({});
    }
  };

  const dialogTitle = node
    ? `更新节点「${node.title}」`
    : "更新节点";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isPending || !formData.title.trim()}
            >
              {isPending ? "更新中..." : "更新节点"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
