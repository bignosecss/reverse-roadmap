"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { useParams } from "next/navigation";
import FlowContent from "@/components/flow/flow-content";
import { ModeToggle } from "@/components/theme-toggle";

export default function GoalPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-between">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            Goal Roadmap: <span className="text-blue-600">{id}</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Interactive goal visualization with React Flow
          </p>
        </div>
        <ModeToggle />
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden">
        <ReactFlowProvider>
          <FlowContent treeId={id} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
