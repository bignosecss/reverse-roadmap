"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { DialogMode, DialogState, DIALOG_CONFIGS } from "@/lib/types/dialog";
import { RrNode } from "@/lib/types/models";

interface NodeDialogProps {
  dialogState: DialogState;
  onOpenChange: (open: boolean) => void;
  currentNode?: RrNode;
  onConfirm: (mode: DialogMode, data?: Partial<RrNode>) => void;
}

export default function NodeDialog({
  dialogState,
  onOpenChange,
  currentNode,
  onConfirm,
}: NodeDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 当 dialog 打开时，根据模式初始化表单数据
  useEffect(() => {
    if (dialogState.isOpen && dialogState.mode) {
      if (dialogState.mode === "edit" && currentNode) {
        setTitle(currentNode.title);
        setDescription(currentNode.description || "");
      } else {
        setTitle("");
        setDescription("");
      }
    }
  }, [dialogState.isOpen, dialogState.mode, currentNode]);

  const handleConfirm = () => {
    if (!dialogState.mode) return;

    if (dialogState.mode === "delete") {
      // 删除操作不需要表单数据
      onConfirm(dialogState.mode);
    } else {
      // 添加和编辑操作需要表单数据
      const data: Partial<RrNode> = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      // 简单验证
      if (!data.title) {
        alert("请输入节点标题");
        return;
      }

      onConfirm(dialogState.mode, data);
    }

    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!dialogState.mode) return null;

  const config = DIALOG_CONFIGS[dialogState.mode];
  const isDeleteMode = dialogState.mode === "delete";

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {!isDeleteMode && (
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
                placeholder="请输入节点描述..."
              />
            </div>
          </div>
        )}

        {isDeleteMode && currentNode && (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              节点：<span className="font-medium">{currentNode.title}</span>
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {config.cancelText}
          </Button>
          <Button variant={config.variant} onClick={handleConfirm}>
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
