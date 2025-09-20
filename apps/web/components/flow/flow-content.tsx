"use client";

import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "next-themes";
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  useNodesInitialized,
  ColorMode,
} from "@xyflow/react";
import RrNodeComponent from "./rr-node";

import "@xyflow/react/dist/style.css";

import { FlowNode, FlowState } from "@/lib/types/models";
import useFlowStore from "@/lib/stores/flow";
import { getLayoutedNodes } from "@/lib/flow-tree/dagre-layout";
import { useGetRrTree } from "@/hooks/use-rr-node";
import { convertTreeToFlow } from "@/lib/flow-tree/converter";
import { useQueryClient } from "@tanstack/react-query";

// 注册自定义节点类型
const nodeTypes = {
  rrNode: RrNodeComponent,
};

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  canvasOpen: state.canvasOpen,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  setCurrentNode: state.setCurrentNode,
  setCanvasOpen: state.setCanvasOpen,
});

const options = {
  includeHiddenNodes: false,
};

export default function FlowContent({ treeId }: { treeId: string }) {
  const { theme } = useTheme();
  const { data: rrTree, isLoading, isError } = useGetRrTree(treeId);
  const {
    nodes,
    edges,
    canvasOpen,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
    setCurrentNode,
    setCanvasOpen,
  } = useFlowStore(useShallow(selector));
  const nodeInitialized = useNodesInitialized(options);
  const prevNodeRef = useRef<FlowNode | null>(null);
  const queryClient = useQueryClient();

  // 第一阶段：数据转换
  useEffect(() => {
    if (!rrTree) return;
    const { nodes: newNodes, edges: newEdges } = convertTreeToFlow(rrTree);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [rrTree, setEdges, setNodes]);

  // 第二阶段：布局计算
  useEffect(() => {
    if (!nodeInitialized || nodes.length === 0) return;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedNodes(
      nodes,
      edges,
      "TB",
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    /**
     * 布局计算仅在节点初始化完成后执行
     * 所以仅需依赖 nodeInitialized 状态
     * 依赖除 nodeInitialized 状态之外的 nodes 和 edges
     * 会导致无限循环
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeInitialized]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: FlowNode) => {
      console.log("Node clicked:", node.id);

      if (prevNodeRef && prevNodeRef.current) {
        queryClient.invalidateQueries({
          queryKey: ["rrNodeContent", prevNodeRef.current.data.rrNode.content],
        });
      }

      setCurrentNode(node.data.rrNode);
      if (!canvasOpen) setCanvasOpen(true);

      if (!prevNodeRef.current) prevNodeRef.current = node;
    },
    [canvasOpen, queryClient, setCanvasOpen, setCurrentNode],
  );

  if (isLoading) {
    return (
      <div className="p-4 text-[var(--secondary)]">Loading tree data...</div>
    );
  }

  if (isError || (!isLoading && !rrTree)) {
    return (
      <div className="p-4 text-[var(--secondary)]">
        Error loading flow data.
      </div>
    );
  }

  return (
    <ReactFlow
      colorMode={theme as ColorMode}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onNodeClick={onNodeClick}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="bg-background"
    >
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}
