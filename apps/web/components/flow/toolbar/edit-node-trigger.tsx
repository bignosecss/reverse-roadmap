"use client";

import React from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BaseDialog } from "@/components/dialogs/base-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { useEditNode } from "../hooks/use-edit-node";
import { NodeStatusToggleGroup } from "../node-status-toggle-group";
import { RrNode } from "@repo/shared/models";
import { formatDate } from "@/lib/utils";

interface EditNodeTriggerProps {
  currentNode: RrNode;
}

export function EditNodeTrigger({ currentNode }: EditNodeTriggerProps) {
  const {
    isDialogOpen,
    handleOpenChange,
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    handleEditRrNode,
    isUpdatingNode,
    isConfirmDisabled,
  } = useEditNode({ currentNode });

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
            title="编辑"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        </DialogTrigger>
      }
      title="编辑节点"
      description="更新当前节点的信息"
      onConfirm={handleEditRrNode}
      disabled={isConfirmDisabled || isUpdatingNode}
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
        {/* Show creation and last edited times */}
        {!!currentNode && (
          <div className="grid gap-1 text-xs text-muted-foreground">
            <p>创建时间: {formatDate(currentNode.createdAt!)}</p>
            <p>最后编辑时间: {formatDate(currentNode.updatedAt!)}</p>
          </div>
        )}
      </div>
    </BaseDialog>
  );
}
