"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import { useParams } from "next/navigation";
import { useGetRrTree } from "@/lib/service/rrTreeApi";
import { convertTreeToFlow } from "@/lib/flow-tree/converter";

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
    console.log("rrTree", rrTree);

    if (rrTree) {
      const flowData = convertTreeToFlow(rrTree);
      setNodes(flowData.nodes);
      setEdges(flowData.edges);
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
        {isLoading ? (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading roadmap...</p>
            </div>
          </div>
        ) : rrTree && nodes.length > 0 ? (
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
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <p className="text-gray-600">No roadmap data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
