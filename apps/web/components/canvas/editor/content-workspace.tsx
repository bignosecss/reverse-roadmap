import { Tabs } from "@/components/ui/tabs";
import useFlowStore from "@/lib/stores/flow";
import { TabsManager } from "./tabs-manager";
import { RichTextEditor } from "./rich-text-editor";
import useCanvasStore from "@/lib/stores/canvas";
import { useTabSelection } from "../hooks/useTabSelection";

export function ContentWorkspace() {
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const selectedRrContentTab = useCanvasStore(
    (state) => state.selectedRrContentTab,
  );

  // Include the tab selection handler functionality
  const { handleSelectTab } = useTabSelection(currentRrNode);

  if (!currentRrNode) {
    return null;
  }

  return (
    <main className="flex-1 overflow-y-auto px-4 pb-4">
      <Tabs value={selectedRrContentTab || ""} onValueChange={handleSelectTab}>
        <TabsManager
          currentRrNode={currentRrNode}
          selectedRrContentTab={selectedRrContentTab}
          onSelectTab={handleSelectTab}
        />
        {currentRrNode.content.map((nodeContent) => (
          <RichTextEditor
            key={nodeContent.rrContent}
            nodeContent={nodeContent}
            selectedRrContentTab={selectedRrContentTab}
          />
        ))}
      </Tabs>
    </main>
  );
}
