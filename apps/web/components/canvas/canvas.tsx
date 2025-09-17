"use client";

import useFlowStore from "@/lib/stores/flow";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { FlowState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import Tiptap from "./tiptap";

const selector = (state: FlowState) => ({
  currentNode: state.currentNode,
  canvasOpen: state.canvasOpen,
  setCanvasOpen: state.setCanvasOpen,
});

export function Canvas() {
  const { currentNode, canvasOpen, setCanvasOpen } = useFlowStore(
    useShallow(selector),
  );

  if (!currentNode) {
    return null;
  }

  return (
    <dialog
      className="fixed left-1/2 z-50 h-full w-1/2 overflow-hidden shadow-[0_0_18px_rgba(0,0,0,0.12)] dark:shadow-[0_0_18px_rgba(0,0,0,0.48)]"
      open={canvasOpen}
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

      <section
        className="flex h-full justify-center"
        style={{ margin: "0px 36px", paddingTop: "64.96px" }}
      >
        <p>{currentNode.description}</p>
        <Tiptap />
      </section>
    </dialog>
  );
}
