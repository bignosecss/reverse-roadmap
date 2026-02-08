import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import useFlowStore from "@/lib/stores/flow";
import useCanvasStore from "@/lib/stores/canvas";
import { useShallow } from "zustand/react/shallow";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function Header({ activeTabId }: { activeTabId: string }) {
  const currentRrNode = useFlowStore(
    useShallow((state) => state.currentRrNode),
  );
  const { savingContent, setCanvasOpen } = useCanvasStore(
    useShallow((state) => ({
      savingContent: state.savingContent,
      setCanvasOpen: state.setCanvasOpen,
    })),
  );

  const queryClient = useQueryClient();
  const handleClose = useCallback(() => {
    setCanvasOpen(false);
    queryClient.invalidateQueries({ queryKey: ["rrContent", activeTabId] });
  }, [activeTabId, queryClient, setCanvasOpen]);

  if (!currentRrNode) {
    return null;
  }

  return (
    <div className="flex items-center p-4">
      <Button variant="ghost" size="icon" onClick={handleClose}>
        <Cross1Icon />
      </Button>
      <h1 className="text-3xl font-bold">{currentRrNode.title}</h1>
      {savingContent && (
        <Badge variant="outline" className="ml-2 flex items-center gap-1">
          <Spinner />
          Saving...
        </Badge>
      )}
    </div>
  );
}
