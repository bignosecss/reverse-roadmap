"use client";

import React from "react";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BaseDeleteDialog } from "@/components/dialogs/base-delete-dialog";
import { RrNode } from "@/lib/types/models";
import { useDeleteNode } from "../hooks/use-delete-node";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DeleteNodeTriggerProps {
  currentNode: RrNode;
}

export function DeleteNodeTrigger({ currentNode }: DeleteNodeTriggerProps) {
  const { isDialogOpen, handleOpenChange, handleDeleteRrNode, isDeletingNode } =
    useDeleteNode({
      currentNode,
    });

  return (
    <BaseDeleteDialog
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      trigger={
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className="h-7 w-7 p-0"
            title="删除"
          >
            <Trash className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
      }
      title={`确认删除节点 "${currentNode.title}"?`}
      description="此操作无法撤销。这将永久删除此节点及其所有子节点。"
      onConfirm={handleDeleteRrNode}
      disabled={isDeletingNode}
    />
  );
}
