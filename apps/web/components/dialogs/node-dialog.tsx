"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { RrNode } from "@/lib/types/models";
import { CreateRrNodeDto, UpdateRrNodeDto } from "@/lib/types/apiRequests";

/**
 * 节点操作类型
 */
export type NodeOperation = "add" | "edit" | "delete";

/**
 * 节点Dialog - 专门处理节点的增删改操作
 * 只处理RrNode相关类型，职责单一且类型安全
 */
interface NodeDialogProps {
  /** 是否打开 */
  open: boolean;
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void;
  /** 操作类型 */
  operation: NodeOperation;
  /** 当前节点（编辑和删除时需要） */
  currentNode?: RrNode;
  /** 确认回调 */
  onConfirm: (
    operation: NodeOperation,
    data?: CreateRrNodeDto | UpdateRrNodeDto,
  ) => void;
  /** 取消回调 */
  onCancel?: () => void;
}

/**
 * 操作配置
 */
const OPERATION_CONFIGS = {
  add: {
    title: "添加节点",
    description: "创建一个新的子节点",
    confirmText: "添加",
    variant: "default" as const,
  },
  edit: {
    title: "编辑节点",
    description: "修改节点信息",
    confirmText: "保存",
    variant: "default" as const,
  },
  delete: {
    title: "删除节点",
    description: "确定要删除这个节点吗？此操作无法撤销。",
    confirmText: "删除",
    variant: "destructive" as const,
  },
} as const;

export function NodeDialog({
  open,
  onOpenChange,
  operation,
  currentNode,
  onConfirm,
  onCancel,
}: NodeDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 当dialog打开时初始化表单数据
  useEffect(() => {
    if (open) {
      if (operation === "edit" && currentNode) {
        setTitle(currentNode.title);
        setDescription(currentNode.description || "");
      } else {
        setTitle("");
        setDescription("");
      }
    }
  }, [open, operation, currentNode]);

  const handleConfirm = () => {
    if (operation === "delete") {
      // 删除操作不需要表单数据
      onConfirm(operation);
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // 简单验证
    if (!trimmedTitle) {
      alert("请输入节点标题");
      return;
    }

    // 构造数据
    if (operation === "add") {
      const data: CreateRrNodeDto = {
        title: trimmedTitle,
        parentId: currentNode?.parentId || null,
        description: trimmedDescription || undefined,
      };
      onConfirm(operation, data);
    } else if (operation === "edit") {
      const data: UpdateRrNodeDto = {
        title: trimmedTitle,
        description: trimmedDescription || undefined,
      };
      onConfirm(operation, data);
    }
  };

  const config = OPERATION_CONFIGS[operation];
  const isDeleteMode = operation === "delete";
  const isFormValid = isDeleteMode || title.trim().length > 0;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={config.title}
      description={config.description}
      confirmText={config.confirmText}
      cancelText="取消"
      confirmVariant={config.variant}
      onConfirm={handleConfirm}
      onCancel={onCancel}
      confirmDisabled={!isFormValid}
    >
      {!isDeleteMode && (
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="node-title">节点标题 *</Label>
            <Input
              id="node-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入节点标题"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="node-description">节点描述</Label>
            <Textarea
              id="node-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
              placeholder="请输入节点描述（可选）"
            />
          </div>
        </div>
      )}

      {isDeleteMode && currentNode && (
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            即将删除节点：
            <span className="font-medium text-foreground">
              {currentNode.title}
            </span>
          </p>
          {currentNode.description && (
            <p className="text-xs text-muted-foreground mt-2">
              {currentNode.description}
            </p>
          )}
        </div>
      )}
    </BaseDialog>
  );
}
