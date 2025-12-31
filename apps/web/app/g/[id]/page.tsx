"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { useParams } from "next/navigation";
import FlowContent from "@/components/flow/flow-content";
import { ModeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Canvas } from "@/components/canvas-panel";
import { cn } from "@/lib/utils";
import useCanvasStore from "@/lib/stores/canvas";

export default function GoalPage() {
  const params = useParams();
  const id = params.id as string;

  const canvasOpen = useCanvasStore((state) => state.canvasOpen);

  return (
    <div className="flex size-full">
      <div
        className={cn(
          "w-full flex flex-col h-full",
          "transition-all duration-300 ease-in-out",
          canvasOpen ? "md:w-1/2" : "w-full",
        )}
      >
        <div className="flex flex-row justify-between items-center p-4 border-b">
          <SidebarTrigger className="md:hidden" />
          <h1>慢慢来，谁还没有一个努力的过程。</h1>
          <ModeToggle />
        </div>

        <div className="flex-1">
          <ReactFlowProvider>
            <FlowContent treeId={id} />
          </ReactFlowProvider>
        </div>
      </div>

      <Canvas />
    </div>
  );
}
