"use client";

import useFlowStore from "@/lib/stores/flow";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { FlowState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { Tiptap } from "./tiptap";
import { cn } from "@/lib/utils";

const selector = (state: FlowState) => ({
  currentNode: state.currentNode,
  canvasOpen: state.canvasOpen,
  setCanvasOpen: state.setCanvasOpen,
});

export function Canvas() {
  const { currentNode, canvasOpen, setCanvasOpen } = useFlowStore(
    useShallow(selector),
  );

  if (!currentNode || !canvasOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 right-0 z-50 h-full w-3/5 overflow-x-scroll border-l bg-background shadow-[0_0_18px_rgba(0,0,0,0.12)] dark:shadow-[0_0_18px_rgba(0,0,0,0.48)]",
        { "translate-x-0": canvasOpen, "translate-x-full": !canvasOpen },
      )}
    >
      <header className="@container touch:px-2.5 h-13 flex flex-none items-center gap-1 px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCanvasOpen(false)}
        >
          <X />
        </Button>
        <span>{currentNode.title}</span>
      </header>

      {!!currentNode.description && (
        <section className="w-full h-fit flex flex-row justify-center">
          <div className="min-w-1/3 max-w-4/5 h-fit py-4">
            <blockquote className="border-l-2 pl-6 italic max-h-fit">
              {currentNode.description}
            </blockquote>
          </div>
        </section>
      )}

      <section className="w-full">
        <Tiptap />
      </section>
    </div>
  );
}
