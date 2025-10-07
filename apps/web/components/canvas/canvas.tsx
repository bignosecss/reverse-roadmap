"use client";

import useFlowStore from "@/lib/stores/flow";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { FlowState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { Tiptap } from "./tiptap";
import { cn } from "@/lib/utils";
import { useGetRrNodeContent } from "@/hooks/use-rr-node-content";

const selector = (state: FlowState) => ({
  currentNode: state.currentNode,
  canvasOpen: state.canvasOpen,
  setCanvasOpen: state.setCanvasOpen,
});

export function Canvas() {
  const { currentNode, canvasOpen, setCanvasOpen } = useFlowStore(
    useShallow(selector),
  );

  const nodeContentId = currentNode?.content;
  const { data: nodeContent, isLoading } = useGetRrNodeContent(
    nodeContentId ? nodeContentId : "",
  );

  if (!currentNode || !canvasOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-20 inset-0 border-l bg-background flex flex-col overflow-y-auto",
        "md:static md:w-3/5",
        "shadow-[0_0_18px_rgba(0,0,0,0.12)] dark:shadow-[0_0_18px_rgba(0,0,0,0.48)]",
        { block: canvasOpen, hidden: !canvasOpen },
      )}
      style={{ scrollbarWidth: "none" }}
    >
      <header className="@container touch:px-2.5 h-13 flex flex-none items-center gap-1 px-2 sticky top-0 bg-background z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCanvasOpen(false)}
        >
          <X />
        </Button>
        <span>{currentNode.title}</span>
      </header>

      <section>
        {!!currentNode.description && (
          <section className="w-full h-fit flex flex-row justify-center">
            <div className="min-w-1/3 max-w-4/5 h-fit py-4">
              <blockquote className="border-l-2 pl-6 italic max-h-fit">
                {currentNode.description}
              </blockquote>
            </div>
          </section>
        )}

        {!isLoading && !!nodeContent && (
          <main className="w-full">
            <Tiptap content={nodeContent} />
          </main>
        )}
      </section>
    </div>
  );
}
