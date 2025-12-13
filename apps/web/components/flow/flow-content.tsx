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

import { FlowState } from "@/lib/types/models";
import useFlowStore from "@/lib/stores/flow";
import { DagreDirection, getLayoutedNodes } from "@/lib/flow-tree/dagre-layout";
import { useGetFlowDataById } from "@/hooks/use-rr-node";
import { SearchNode } from "./search-node";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { FIT_VIEW_OPTIONS } from "./constants";
import useCanvasStore from "@/lib/stores/canvas";
import { useFlowConnection } from "./hooks/use-flow-connection";

// 注册自定义节点类型
const nodeTypes = {
  rrNode: RrNodeComponent,
};

const selector = (state: FlowState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  getNode: state.getNode,
});

export default function FlowContent({ treeId }: { treeId: string }) {
  const { theme } = useTheme();
  const { data: flowData, isLoading, isError } = useGetFlowDataById(treeId);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
    getNode,
  } = useFlowStore(useShallow(selector));
  const { setCenter, fitView } = useReactFlow();
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const setCanvasOpen = useCanvasStore((state) => state.setCanvasOpen);

  // Use the custom hook to handle connection logic
  const { onConnect } = useFlowConnection({
    edges,
    nodes,
    setEdges,
    setNodes,
  });

  const onLayout = useCallback(
    (direction: DagreDirection) => {
      if (flowData) {
        const layouted = getLayoutedNodes(
          flowData.nodes,
          flowData.edges,
          direction,
        );
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      }
    },
    [flowData, setEdges, setNodes],
  );

  const handleButtonLayout = useCallback(
    (d: DagreDirection) => {
      onLayout(d);
      fitView(FIT_VIEW_OPTIONS);
    },
    [fitView, onLayout],
  );

  useEffect(() => {
    if (flowData) {
      onLayout(DagreDirection.TB);
    }
    if (currentRrNode && !getNode(currentRrNode._id)) {
      setCanvasOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowData, onLayout, getNode, setCanvasOpen]);

  if (isLoading) {
    return (
      <div className="size-full flex justify-center items-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  if (isError || (!isLoading && !flowData)) {
    return (
      <div className="p-4 text-[var(--destructive)] size-full flex justify-center items-center">
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
            <Button
              key={dir}
              variant="outline"
              onClick={() => handleButtonLayout(dir)}
            >
              {dir}
            </Button>
          ))}
        </ButtonGroup>
      </Panel>
    </ReactFlow>
  );
}
