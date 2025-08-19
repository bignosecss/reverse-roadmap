"use client";

import React, { useState } from "react";
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
import type { RrNode } from "@/lib/types/models";

interface CreateNodeData {
  title: string;
  description?: string;
  parentId: string;
  rootId: string;
}

interface AddNodeDialogProps {
  /** 父节点信息，用于创建子节点 */
  parentNode?: RrNode;
  /** 根节点ID */
  rootId: string;
  /** 外部控制对话框开关状态 */
  open: boolean;
  /** 外部控制对话框开关状态的回调 */
  onOpenChange: (open: boolean) => void;
  /** 创建节点的回调函数 */
  onSubmit: (data: CreateNodeData) => void;
  /** 是否正在提交 */
  isSubmitting?: boolean;
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
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: AddNodeDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

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

    if (!validateForm() || !parentNode?._id) {
      return;
    }

    const nodeData: CreateNodeData = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      parentId: parentNode._id,
      rootId,
    };

    // 调用父组件传入的回调函数
    onSubmit(nodeData);

    // 重置表单并关闭对话框
    setFormData({ title: "", description: "" });
    setErrors({});
    onOpenChange(false);
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

  const dialogTitle = parentNode
    ? `为「${parentNode.title}」添加子节点`
    : "添加根节点";

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? "创建中..." : "创建节点"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
