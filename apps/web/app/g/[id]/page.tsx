"use client";

import { useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
} from "@xyflow/react";
import { useParams } from "next/navigation";
import { useGetRrTree } from "@/lib/service/rrTreeApi";
import {
  useCreateNode,
  useUpdateNode,
  useDeleteNode,
} from "@/lib/service/rrNodeApi";
import { toast } from "sonner";
import { convertTreeToFlow } from "@/lib/flow-tree";
import FlowContent from "@/components/flow/flow-content";

import "@xyflow/react/dist/style.css";
import { FlowEdge, FlowNode, RrNode } from "@/lib/types/models";

export default function GoalPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: rrTree, isLoading, refetch } = useGetRrTree(id);
  const { mutate: createNode, isPending: isCreating } = useCreateNode();
  const { mutate: updateNode, isPending: isUpdating } = useUpdateNode();
  const { mutate: deleteNode, isPending: isDeleting } = useDeleteNode();

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if (!isLoading && rrTree) {
      const { nodes: nodeWithDefaultPosition, edges: convertedEdges } =
        convertTreeToFlow(rrTree);
      setNodes(nodeWithDefaultPosition);
      setEdges(convertedEdges);
    }
  }, [isLoading, rrTree, setEdges, setNodes]);

  // 处理创建节点
  const handleCreateNode = (data: {
    title: string;
    description?: string;
    parentId: string;
    rootId: string;
  }) => {
    createNode(data, {
      onSuccess: (newNode: RrNode) => {
        toast.success("节点创建成功", {
          description: `已成功创建节点「${newNode.title}」`,
        });
        refetch(); // 重新获取数据
      },
      onError: (error: unknown) => {
        console.error("创建节点失败:", error);
        toast.error("节点创建失败", {
          description: error instanceof Error ? error.message : "请稍后重试",
        });
      },
    });
  };

  // 处理更新节点
  const handleUpdateNode = (data: {
    nodeId: string;
    title: string;
    description?: string;
    rootId: string;
  }) => {
    updateNode(data, {
      onSuccess: (updatedNode: RrNode) => {
        toast.success("节点更新成功", {
          description: `已成功更新节点「${updatedNode.title}」`,
        });
        refetch(); // 重新获取数据
      },
      onError: (error: unknown) => {
        console.error("更新节点失败:", error);
        toast.error("节点更新失败", {
          description: error instanceof Error ? error.message : "请稍后重试",
        });
      },
    });
  };

  // 处理删除节点
  const handleDeleteNode = (data: { nodeId: string; rootId: string }) => {
    deleteNode(data, {
      onSuccess: (deletedNode: RrNode) => {
        toast.success("节点删除成功", {
          description: `已成功删除节点「${deletedNode.title}」`,
        });
        refetch(); // 重新获取数据
      },
      onError: (error: unknown) => {
        console.error("删除节点失败:", error);
        toast.error("节点删除失败", {
          description: error instanceof Error ? error.message : "请稍后重试",
        });
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Goal Roadmap: <span className="text-blue-600">{id}</span>
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Interactive goal visualization with React Flow
        </p>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden">
        <FlowContent
          isLoading={isLoading}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          rootId={id}
          onCreateNode={handleCreateNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          isCreating={isCreating}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
