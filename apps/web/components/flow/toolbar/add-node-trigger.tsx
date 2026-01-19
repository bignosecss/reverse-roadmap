"use client";

import React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BaseDialog } from "@/components/dialogs/base-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { useAddNode } from "../hooks/use-add-node";
import { NodeStatusToggleGroup } from "../node-status-toggle-group";
import { RrNode } from "@repo/shared/models";

interface AddNodeTriggerProps {
  currentNode: RrNode;
}

export function AddNodeTrigger({ currentNode }: AddNodeTriggerProps) {
  const {
    isDialogOpen,
    handleOpenChange,
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    excludeFromRAG,
    setExcludeFromRAG,
    handleAddRrNode,
    isAddingNode,
    isConfirmDisabled,
  } = useAddNode({ currentNode });

  return (
    <BaseDialog
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            title="添加"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </DialogTrigger>
      }
      title="添加节点"
      description="创建一个新的子节点"
      onConfirm={handleAddRrNode}
      disabled={isConfirmDisabled || isAddingNode}
    >
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
            className="min-h-25"
            placeholder="请输入节点描述（可选）"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="exclude-from-rag" className="cursor-pointer">
            从 RAG 排除
          </Label>
          <Switch
            id="exclude-from-rag"
            checked={excludeFromRAG}
            onCheckedChange={setExcludeFromRAG}
          />
        </div>
        <div className="grid gap-3">
          <Label>节点状态</Label>
          <NodeStatusToggleGroup value={status} onChange={setStatus} />
        </div>
      </div>
    </BaseDialog>
  );
}
