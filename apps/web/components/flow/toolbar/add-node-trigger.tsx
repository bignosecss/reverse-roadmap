"use client";

import React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BaseDialog } from "@/components/dialogs/base-dialog";
import { RrNode } from "@/lib/types/models";
import { DialogTrigger } from "@/components/ui/dialog";
import { useAddNode } from "../hooks/use-add-node";
import { NodeStatusToggleGroup } from "../node-status-toggle-group";

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
            className="min-h-[100px]"
            placeholder="请输入节点描述（可选）"
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
