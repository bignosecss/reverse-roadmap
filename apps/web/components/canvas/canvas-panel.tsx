"use client";

import useFlowStore from "@/lib/stores/flow";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { FlowState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";

const selector = (state: FlowState) => ({
  currentNode: state.currentNode,
  canvasOpen: state.canvasOpen,
  setCanvasOpen: state.setCanvasOpen,
});

export default function CanvasPanel() {
  const { currentNode, canvasOpen, setCanvasOpen } = useFlowStore(
    useShallow(selector),
  );

  if (!currentNode) {
    return null;
  }

  return (
    <dialog
      className="fixed left-1/2 z-50 h-full w-1/2 border-2"
      open={canvasOpen}
    >
      <header className="@container touch:px-2.5 h-header-height flex flex-none items-center gap-1 px-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCanvasOpen(false)}
        >
          <X />
        </Button>
        <span>{currentNode.title}</span>
      </header>

      {currentNode.description}
    </dialog>
  );
}
