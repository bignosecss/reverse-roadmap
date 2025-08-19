"use client";

import { useEffect, createContext, useContext } from "react";
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

// 创建 context 来传递回调函数
interface FlowContextType {
  rootId: string;
  onCreateNode: (data: {
    title: string;
    description?: string;
    parentId: string;
    rootId: string;
  }) => void;
  onUpdateNode: (data: {
    nodeId: string;
    title: string;
    description?: string;
    rootId: string;
  }) => void;
  onDeleteNode: (data: { nodeId: string; rootId: string }) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const FlowContext = createContext<FlowContextType | null>(null);

export const useFlowContext = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowContext must be used within FlowContext.Provider");
  }
  return context;
};

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
  rootId: string;
  onCreateNode: (data: {
    title: string;
    description?: string;
    parentId: string;
    rootId: string;
  }) => void;
  onUpdateNode: (data: {
    nodeId: string;
    title: string;
    description?: string;
    rootId: string;
  }) => void;
  onDeleteNode: (data: { nodeId: string; rootId: string }) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

function FlowContentInner({
  isLoading,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  rootId,
  onCreateNode,
  onUpdateNode,
  onDeleteNode,
  isCreating,
  isUpdating,
  isDeleting,
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
    <FlowContext.Provider
      value={{
        rootId,
        onCreateNode,
        onUpdateNode,
        onDeleteNode,
        isCreating,
        isUpdating,
        isDeleting,
      }}
    >
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
    </FlowContext.Provider>
  );
}

export default function FlowContent(props: FlowContentProps) {
  return (
    <ReactFlowProvider>
      <FlowContentInner {...props} />
    </ReactFlowProvider>
  );
}
