"use client";

import useFlowStore from "@/lib/stores/flow";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";
import { CanvasState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import useCanvasStore from "@/lib/stores/canvas";
import { CanvasTabs } from "./canvas-tabs";

const selector = (state: CanvasState) => ({
  canvasOpen: state.canvasOpen,
  savingContent: state.savingContent,
  setCanvasOpen: state.setCanvasOpen,
});

export function Canvas() {
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const { canvasOpen, savingContent, setCanvasOpen } = useCanvasStore(
    useShallow(selector),
  );

  if (!currentRrNode || !canvasOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "md:border-l bg-background flex flex-1 flex-col overflow-y-auto",
        "fixed z-20 inset-0", // 在小屏幕下 Canvas 占据整个屏幕
        "md:static md:w-[50vw]",
        "md:shadow-[0_0_18px_var(--border)]",
        { block: canvasOpen, hidden: !canvasOpen },
      )}
      style={{ scrollbarWidth: "none" }}
    >
      <header
        className={cn(
          "@container touch:px-2.5 h-13 flex flex-none items-center gap-1 px-2",
          "sticky top-0 bg-background z-10",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCanvasOpen(false)}
        >
          <X />
        </Button>
        <span>{currentRrNode.title}</span>
        {savingContent && (
          <Badge variant="outline" className="ml-1">
            <Spinner />
            Saving...
          </Badge>
        )}
      </header>

      <section>
        {!!currentRrNode.description && (
          <div className="w-full h-fit flex flex-row justify-center py-8 px-4">
            <div className="min-w-1/3 max-w-4/5 h-fit">
              <blockquote className="border-l-2 pl-6 italic max-h-fit">
                {currentRrNode.description}
              </blockquote>
            </div>
          </div>
        )}

        <main className="w-full px-8">
          {currentRrNode.content.length > 0 ? (
            <CanvasTabs currentRrNode={currentRrNode} />
          ) : (
            <div className="w-full, px-8 text-[var(--destructive)]">
              Content attribute of current rr node has no data
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
