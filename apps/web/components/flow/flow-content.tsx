"use client";

import { useCallback, useEffect, useMemo } from "react";
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

import { FlowState } from "@/lib/types/models";
import useFlowStore from "@/lib/stores/flow";
import { DagreDirection, getLayoutedNodes } from "@/lib/flow-tree/dagre-layout";
import { useGetRrTreeById } from "@/hooks/use-rr-node";
import { convertTreeToFlow } from "@/lib/flow-tree/converter";
import { SearchNode } from "./search-node";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { FIT_VIEW_OPTIONS } from "./constants";

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
  const { data: rrTree, isLoading, isError } = useGetRrTreeById(treeId);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    setEdges,
  } = useFlowStore(useShallow(selector));
  const { setCenter, fitView } = useReactFlow();

  const flowData = useMemo(() => {
    if (rrTree) {
      return convertTreeToFlow(rrTree);
    }
    return { nodes: [], edges: [] };
  }, [rrTree]);
  const onLayout = useCallback(
    (direction: DagreDirection) => {
      const layouted = getLayoutedNodes(
        flowData.nodes,
        flowData.edges,
        direction,
      );
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      fitView(FIT_VIEW_OPTIONS);
    },
    [flowData, setEdges, setNodes, fitView],
  );

  useEffect(() => {
    if (rrTree) {
      onLayout(DagreDirection.TB);
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
      <div className="p-4 text-[var(--destructive)]">
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
      fitViewOptions={FIT_VIEW_OPTIONS}
      minZoom={0.1}
      className="bg-background"
    >
      <Controls fitViewOptions={FIT_VIEW_OPTIONS} />
      <MiniMap />
      <Background variant={BackgroundVariant.Dots} />
      <Panel position="top-right">
        <SearchNode nodes={nodes} setCenter={setCenter} />
      </Panel>
      <Panel position="top-left">
        <ButtonGroup aria-label="Layout Direction">
          {Object.values(DagreDirection).map((dir) => (
            <Button key={dir} variant="outline" onClick={() => onLayout(dir)}>
              {dir}
            </Button>
          ))}
        </ButtonGroup>
      </Panel>
    </ReactFlow>
  );
}
