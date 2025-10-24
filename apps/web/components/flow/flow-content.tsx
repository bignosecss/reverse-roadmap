"use client";

import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "next-themes";
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ColorMode,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import RrNodeComponent from "./rr-node";

import "@xyflow/react/dist/style.css";

import { FlowState, RrNode } from "@/lib/types/models";
import useFlowStore from "@/lib/stores/flow";
import { DagreDirection, getLayoutedNodes } from "@/lib/flow-tree/dagre-layout";
import { useGetRrTree } from "@/hooks/use-rr-node";
import { convertTreeToFlow } from "@/lib/flow-tree/converter";
import { SearchNode } from "./search-node";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

// 注册自定义节点类型
const nodeTypes = {
  rrNode: RrNodeComponent,
};

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
});

export default function FlowContent({ treeId }: { treeId: string }) {
  const { theme } = useTheme();
  const { data: rrTree, isLoading, isError } = useGetRrTree(treeId);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
  } = useFlowStore(useShallow(selector));
  const { setCenter } = useReactFlow();

  const onLayout = useCallback(
    (direction: DagreDirection, rrTree: RrNode) => {
      const { nodes: flowNodes, edges: flowEdges } = convertTreeToFlow(rrTree);
      const layouted = getLayoutedNodes(flowNodes, flowEdges, direction);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    },
    [setEdges, setNodes],
  );

  useEffect(() => {
    if (rrTree) {
      onLayout(DagreDirection.TB, rrTree);
    }
  }, [rrTree, onLayout]);

  if (isLoading) {
    return (
      <div className="size-full flex justify-center items-center">
        <Spinner className="size-12" />
      </div>
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
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.1}
      className="bg-background"
    >
      <Controls />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
      <Panel position="top-right">
        <SearchNode nodes={nodes} setCenter={setCenter} />
      </Panel>
      {!!rrTree && (
        <Panel position="top-left">
          <Button onClick={() => onLayout(DagreDirection.TB, rrTree)}>
            Vertical Layout
          </Button>
          <Button onClick={() => onLayout(DagreDirection.LR, rrTree)}>
            Horizontal Layout
          </Button>
        </Panel>
      )}
    </ReactFlow>
  );
}
