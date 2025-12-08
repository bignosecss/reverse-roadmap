import { CanvasTabs } from "./canvas-tabs";
import useFlowStore from "@/lib/stores/flow";

export function ContentWorkspace() {
  const currentRrNode = useFlowStore((state) => state.currentRrNode);

  if (!currentRrNode) {
    return null;
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-4">
      <CanvasTabs currentRrNode={currentRrNode} />
    </main>
  );
}
