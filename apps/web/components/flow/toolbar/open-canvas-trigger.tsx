import { Button } from "@/components/ui/button";
import useCanvasStore from "@/lib/stores/canvas";
import useFlowStore from "@/lib/stores/flow";
import { CanvasState } from "@/lib/types/models";
import { RrNode } from "@repo/shared";
import { ChevronsRight } from "lucide-react";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useSidebar } from "@/components/ui/sidebar";

interface OpenCanvasProps {
  currentNode: RrNode;
}

const canvasStoreSelector = (state: CanvasState) => ({
  canvasOpen: state.canvasOpen,
  setCanvasOpen: state.setCanvasOpen,
});

export function OpenCanvasTrigger({ currentNode }: OpenCanvasProps) {
  const { canvasOpen, setCanvasOpen } = useCanvasStore(
    useShallow(canvasStoreSelector),
  );
  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);
  const { open, setOpen } = useSidebar();

  const handleClick = useCallback(() => {
    if (canvasOpen) return;
    if (open) setOpen(false);
    setCurrentRrNode(currentNode);
    setCanvasOpen(true);
  }, [canvasOpen, currentNode, open, setCanvasOpen, setCurrentRrNode, setOpen]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={"h-7 w-7 p-0"}
      disabled={canvasOpen}
      title="打开Canvas"
    >
      <ChevronsRight className="h-3 w-3" />
    </Button>
  );
}
