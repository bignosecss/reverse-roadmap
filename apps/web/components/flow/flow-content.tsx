"use client";

import { useEffect, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Background,
  BackgroundVariant,
  useReactFlow,
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
  hasData: boolean;
}

function FlowContentInner({
  isLoading,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  hasData,
}: FlowContentProps) {
  const layoutAppliedRef = useRef(false);
  const nodesLengthRef = useRef(0);
  const { fitView } = useReactFlow();

  useEffect(() => {
    // 早期返回：没有数据或节点为空时重置状态
    if (!hasData || nodes.length === 0) {
      layoutAppliedRef.current = false;
      nodesLengthRef.current = 0;
      return;
    }

    // 检查是否需要重新布局：节点数量变化或者还没有应用过布局
    const needsLayout =
      !layoutAppliedRef.current || nodes.length !== nodesLengthRef.current;

    // 早期返回：不需要布局时直接退出
    if (!needsLayout) {
      return;
    }

    // 检查节点是否有真实的 measured 尺寸
    const hasMeasuredNodes = nodes.some(
      (node) => node.measured?.width && node.measured?.height,
    );

    // 早期返回：节点尺寸未测量完成时直接退出
    if (!hasMeasuredNodes) {
      return;
    }

    // 执行布局逻辑
    const { newNodes } = getLayoutedNodes(nodes, edges, "TB");

    // 更新节点位置
    onNodesChange(
      newNodes.map((node) => ({
        type: "position",
        id: node.id,
        position: node.position,
      })),
    );

    // 标记已应用布局
    layoutAppliedRef.current = true;
    nodesLengthRef.current = nodes.length;

    // 在下一个渲染周期调用 fitView
    setTimeout(() => {
      fitView({
        padding: 0.1,
        maxZoom: 1.5,
        minZoom: 0.1,
      });
    }, 0);
  }, [hasData, nodes, edges, onNodesChange, fitView]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!hasData || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No roadmap data available</p>
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
      className="bg-gray-50"
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
