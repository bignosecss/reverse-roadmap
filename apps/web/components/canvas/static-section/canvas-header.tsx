import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useFlowStore from "@/lib/stores/flow";
import useCanvasStore from "@/lib/stores/canvas";
import { useShallow } from "zustand/react/shallow";

export function CanvasHeader() {
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const { savingContent, setCanvasOpen } = useCanvasStore(
    useShallow((state) => ({
      savingContent: state.savingContent,
      setCanvasOpen: state.setCanvasOpen,
    })),
  );

  if (!currentRrNode) {
    return null;
  }

  return (
    <header
      className={cn(
        "@container touch:px-2.5 h-13 flex flex-none items-center gap-1 px-2",
        "sticky top-0 bg-background z-10",
      )}
    >
      <Button variant="ghost" size="icon" onClick={() => setCanvasOpen(false)}>
        <X />
      </Button>
      <span className="font-medium truncate">{currentRrNode.title}</span>
      {savingContent && (
        <Badge variant="outline" className="ml-2 flex items-center gap-1">
          <Spinner />
          Saving...
        </Badge>
      )}
    </header>
  );
}
