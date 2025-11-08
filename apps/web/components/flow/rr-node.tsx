import { useParams } from "next/navigation";
import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { FlowNode, RrNode } from "@/lib/types/models";
import RrNodeToolbar from "./rr-node-toolbar";
import RrNodeCard from "./rr-node-card";
import { NodeDialog, NodeOperation } from "../dialogs/node-dialog";
import {
  useCreate,
  useUpdateRrNodeById,
  useRemoveRrNodeById,
} from "@/hooks/use-rr-node";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

/**
 * 自定义 RrNode 组件
 * 用于在 React Flow 中渲染思维导图节点
 */
export default function RrNodeComponent({
  data,
  selected,
}: NodeProps<FlowNode>) {
  const { rrNode } = data;

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    operation: "add" as NodeOperation,
  });

  // 判断是否为根节点
  const treeId = useParams().id as string;
  const isRootNode = rrNode._id === treeId;

  // 操作节点
  const queryClient = useQueryClient();
  const { mutate: createRrNode } = useCreate();
  const { mutate: updateRrNode } = useUpdateRrNodeById(rrNode._id);
  const { mutate: removeRrNode } = useRemoveRrNodeById(rrNode._id);

  // 处理 Dialog 确认操作
  const handleDialogConfirm = (
    operation: NodeOperation,
    data?: Partial<typeof rrNode>,
  ) => {
    switch (operation) {
      case "add":
        createRrNode(
          {
            title: data!.title!,
            description: data?.description,
            parent: rrNode._id,
          },
          {
            onSuccess: (newNode: RrNode) => {
              queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
              toast.success("节点添加成功", {
                description: `新节点 "${newNode.title}" 已添加`,
              });
            },
            onError: (error: Error) => {
              toast.error("节点添加失败", {
                description: error?.message || "发生未知错误",
              });
            },
          },
        );
        break;
      case "edit":
        updateRrNode(
          {
            title: data!.title!,
            description: data?.description,
          },
          {
            onSuccess: (updatedNode: RrNode) => {
              queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
              toast.success("节点更新成功", {
                description: `节点 "${updatedNode.title}" 已更新`,
              });
            },
            onError: (error: Error) => {
              toast.error("节点更新失败", {
                description: error?.message || "发生未知错误",
              });
            },
          },
        );
        break;
      case "delete":
        removeRrNode(undefined, {
          onSuccess: (deletedNode: RrNode) => {
            queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
            toast.success("节点删除成功", {
              description: `节点 "${deletedNode.title}" 已删除`,
            });
          },
          onError: (error: Error) => {
            toast.error("节点删除失败", {
              description: error?.message || "发生未知错误",
            });
          },
        });
        break;
    }
  };

  return (
    <>
      {/* 工具栏 */}
      <RrNodeToolbar
        isVisible={selected}
        isRootNode={isRootNode}
        onAdd={() => setDialogState({ isOpen: true, operation: "add" })}
        onUpdate={() => setDialogState({ isOpen: true, operation: "edit" })}
        onRemove={() => setDialogState({ isOpen: true, operation: "delete" })}
      />

      {/* 节点卡片 */}
      <RrNodeCard
        rrNode={rrNode}
        isSelected={selected}
        isRootNode={isRootNode}
      />

      {/* 通用 Dialog */}
      <NodeDialog
        open={dialogState.isOpen}
        onOpenChange={(open: boolean) =>
          setDialogState((prev) => ({ ...prev, isOpen: open }))
        }
        operation={dialogState.operation}
        currentNode={rrNode}
        onConfirm={handleDialogConfirm}
        onCancel={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}
