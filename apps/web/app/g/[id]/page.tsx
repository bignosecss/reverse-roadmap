"use client";

import { useCallback, Suspense, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import { useParams } from "next/navigation";
import { useGetRrTree } from "@/lib/service/rrTreeApi";

import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "1",
    type: "input",
    position: { x: 250, y: 25 },
    data: { label: "Goal Start" },
  },
  {
    id: "2",
    position: { x: 100, y: 125 },
    data: { label: "Milestone 1" },
  },
  {
    id: "3",
    position: { x: 400, y: 125 },
    data: { label: "Milestone 2" },
  },
  {
    id: "4",
    type: "output",
    position: { x: 250, y: 250 },
    data: { label: "Goal Complete" },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-4", source: "3", target: "4" },
];

export default function GoalPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: rrTree, isLoading } = useGetRrTree(id);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if (!isLoading && rrTree) {
      console.log("rrTree", rrTree);
    }
  }, [isLoading, rrTree]);

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
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
}
