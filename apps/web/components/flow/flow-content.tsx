"use client";

import { useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
  useNodesInitialized,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import RrNodeComponent from "./rr-node";
import { getLayoutedNodes } from "@/lib/flow-tree";
import { CustomControls } from "./custom-controls";

import "@xyflow/react/dist/style.css";

// 注册自定义节点类型
const nodeTypes = {
  rrNode: RrNodeComponent,
};

interface FlowContentProps {
  isLoading: boolean;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

function FlowContentInner({
  isLoading,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: FlowContentProps) {
  const { fitView, getNodes, setNodes } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  // 当节点初始化完成且测量完成后，触发布局
  useEffect(() => {
    if (nodesInitialized && nodes.length > 0) {
      const currentNodes = getNodes();

      // 使用测量后的尺寸重新计算布局
      const { newNodes } = getLayoutedNodes(currentNodes, edges, "TB");

      // 更新节点位置
      setNodes(newNodes);

      // 在下一个渲染周期调用 fitView
      setTimeout(() => {
        fitView({
          padding: 0.1,
          maxZoom: 1.5,
          minZoom: 0.1,
        });
      }, 0);
    }
  }, [nodesInitialized, nodes.length, getNodes, setNodes, edges, fitView]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0 && edges.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">No roadmap data available</p>
        </div>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
      maxZoom={2.0}
      className="bg-background"
    >
      <CustomControls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

export default function FlowContent(props: FlowContentProps) {
  return (
    <ReactFlowProvider>
      <FlowContentInner {...props} />
    </ReactFlowProvider>
  );
}
