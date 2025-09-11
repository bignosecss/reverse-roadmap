"use client";

import useFlowStore from "@/lib/stores/flow";

export default function CanvasPanel() {
  const currentNode = useFlowStore((state) => state.currentNode);
  const canvasOpen = useFlowStore((state) => state.canvasOpen);

  return (
    <dialog className="fixed left-1/2 z-50 h-full w-1/2" open={canvasOpen}>
      {!!currentNode && (
        <div className="p-1.5">
          <div>{currentNode.title}</div>
          <div>{currentNode.description}</div>
        </div>
      )}
    </dialog>
  );
}
