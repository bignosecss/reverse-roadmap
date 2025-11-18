import { useParams } from "next/navigation";
import React, { useState, useCallback } from "react";
import { NodeProps } from "@xyflow/react";
import { FlowNode, FlowState, RrNode } from "@/lib/types/models";
import RrNodeToolbar from "./rr-node-toolbar";
import RrNodeCard from "./rr-node-card";
import { NodeDialog, NodeOperation } from "../dialogs/node-dialog";
import {
  useCreate,
  useUpdateRrNodeById,
  useRemoveRrNodeById,
} from "@/hooks/use-rr-node";
import { toast } from "sonner";
import useCanvasStore from "@/lib/stores/canvas";
import useFlowStore from "@/lib/stores/flow";
import { useShallow } from "zustand/react/shallow";
import { useQueryClient } from "@tanstack/react-query";

const flowSelector = (state: FlowState) => ({
  addNode: state.addNode,
  updateNode: state.updateNode,
  removeNode: state.removeNode,
  nodes: state.nodes,
  edges: state.edges,
});

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

  const { addNode, updateNode, removeNode, nodes, edges } = useFlowStore(
    useShallow(flowSelector),
  );

  const getNode = useCallback(
    (id: string) => nodes.find((n) => n.id === id),
    [nodes],
  );
  const getEdge = useCallback(
    (id: string) => edges.find((e) => e.target === id),
    [edges],
  );

  // 判断是否为根节点
  const treeId = useParams().id as string;
  const isRootNode = rrNode._id === treeId;

  // 操作节点
  const queryClient = useQueryClient();
  const { mutate: createRrNode } = useCreate();
  const { mutate: updateRrNode } = useUpdateRrNodeById(rrNode._id);
  const { mutate: removeRrNode } = useRemoveRrNodeById(rrNode._id);
  const setCanvasOpen = useCanvasStore((state) => state.setCanvasOpen);

  // 处理 Dialog 确认操作
  const handleDialogConfirm = (
    operation: NodeOperation,
    nodeData?: Partial<RrNode>,
  ) => {
    const currentNode = getNode(rrNode._id);
    if (!currentNode) return;

    switch (operation) {
      case "add": {
        createRrNode(
          {
            title: nodeData!.title!,
            description: nodeData?.description,
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
      }
      case "edit": {
        const originalNode = getNode(rrNode._id)?.data.rrNode;
        if (!originalNode) return;

        updateNode(rrNode._id, { ...nodeData, pending: true });

        updateRrNode(
          {
            title: nodeData!.title!,
            description: nodeData?.description,
          },
          {
            onSuccess: (updatedNode: RrNode) => {
              updateNode(rrNode._id, { ...updatedNode, pending: false });
              toast.success("节点更新成功", {
                description: `节点 "${updatedNode.title}" 已更新`,
              });
            },
            onError: (error: Error) => {
              updateNode(rrNode._id, originalNode);
              toast.error("节点更新失败", {
                description: error?.message || "发生未知错误",
              });
            },
          },
        );
        break;
      }
      case "delete": {
        const nodeToRemove = getNode(rrNode._id);
        const edgeToRemove = getEdge(rrNode._id);

        if (!nodeToRemove) return;

        removeRrNode(undefined, {
          onSuccess: (deletedNode: RrNode) => {
            removeNode(rrNode._id);
            setCanvasOpen(false);
            toast.success("节点删除成功", {
              description: `节点 "${deletedNode.title}" 已删除`,
            });
          },
          onError: (error: Error) => {
            if (edgeToRemove) {
              addNode(nodeToRemove, edgeToRemove);
            }
            toast.error("节点删除失败", {
              description: error?.message || "发生未知错误",
            });
          },
        });
        break;
      }
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
