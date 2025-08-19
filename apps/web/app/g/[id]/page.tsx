"use client";

import { useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import { useParams } from "next/navigation";
import { useGetRrTree } from "@/lib/service/rrTreeApi";
import { convertTreeToFlow } from "@/lib/flow-tree";
import FlowContent from "@/components/flow/flow-content";

import "@xyflow/react/dist/style.css";

export default function GoalPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: rrTree, isLoading } = useGetRrTree(id);

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

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
        />
      </div>
    </div>
  );
}
