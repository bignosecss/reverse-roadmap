import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import useFlowStore from "@/lib/stores/flow";
import useCanvasStore from "@/lib/stores/canvas";
import { useShallow } from "zustand/react/shallow";

export function Header() {
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
    <div className="flex items-center p-4">
      <Button variant="ghost" size="icon" onClick={() => setCanvasOpen(false)}>
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
