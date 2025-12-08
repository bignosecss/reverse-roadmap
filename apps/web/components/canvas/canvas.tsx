"use client";

import useFlowStore from "@/lib/stores/flow";
import { cn } from "@/lib/utils";
import useCanvasStore from "@/lib/stores/canvas";
import { CanvasHeader, DescriptionQuote } from "./static-section";
import { ContentWorkspace } from "./editor";

export function Canvas() {
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const canvasOpen = useCanvasStore((state) => state.canvasOpen);

  if (!currentRrNode || !canvasOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "md:border-l bg-background flex flex-col h-full",
        "fixed z-20 inset-0", // 在小屏幕下 Canvas 占据整个屏幕
        "md:static md:w-[50vw] md:h-auto md:flex-1",
        "md:shadow-[0_0_18px_var(--border)]",
        { block: canvasOpen, hidden: !canvasOpen },
      )}
      style={{ scrollbarWidth: "none" }}
    >
      <CanvasHeader />
      <DescriptionQuote />
      <ContentWorkspace />
    </div>
  );
}
