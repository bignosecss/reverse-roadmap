import { RrNode, RrRootStatus } from "@/lib/types/models";
import { Tabs, TabsList } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useCanvasTabs } from "../hooks/useCanvasTabs";
import { useTabEditing } from "../hooks/useTabEditing";
import { useActiveRrContent } from "../hooks/useActiveRrContent";
import { EditableTabTrigger } from "./editable-tab-trigger";
import { TabContentPanel } from "./tab-content-panel";
import useSidebarStore from "@/lib/stores/sidebar";

export function CanvasTabs({ currentRrNode }: { currentRrNode: RrNode }) {
  const mode = useSidebarStore((state) => state.mode);

  const {
    selectedRrContentTab,
    handleCreateRrContent,
    handleRemoveRrContent,
    handleSelectRrContent,
  } = useCanvasTabs(currentRrNode);

  const {
    editingState,
    isRrContentTabUpdating,
    handleTabDoubleClick,
    handleUpdateRrContentTab,
    setEditingTabValue,
    setEditingTab,
  } = useTabEditing(currentRrNode);

  const { rrContent, isPending, saveRrNodeContent } =
    useActiveRrContent(selectedRrContentTab);

  if (!currentRrNode) {
    return null;
  }

  return (
    <Tabs
      key={currentRrNode._id}
      value={selectedRrContentTab || ""}
      onValueChange={handleSelectRrContent}
    >
      <div className="p-5 flex flex-row items-center">
        <TabsList>
          {currentRrNode.content.map((nodeContent) => (
            <EditableTabTrigger
              mode={mode}
              key={nodeContent.rrContent}
              nodeContent={nodeContent}
              selectedRrContentTab={selectedRrContentTab}
              editingState={editingState}
              isRrContentTabUpdating={isRrContentTabUpdating}
              handleTabDoubleClick={handleTabDoubleClick}
              setEditingTabValue={setEditingTabValue}
              setEditingTab={setEditingTab}
              handleUpdateRrContentTab={handleUpdateRrContentTab}
              handleRemoveRrContent={handleRemoveRrContent}
            />
          ))}
        </TabsList>
        {mode === RrRootStatus.private && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleCreateRrContent}
          >
            <PlusIcon className="size-4" />
          </Button>
        )}
      </div>
      {currentRrNode.content.map((nodeContent) => (
        <TabContentPanel
          key={nodeContent.rrContent}
          nodeContent={nodeContent}
          isPending={isPending}
          rrContent={rrContent}
          saveRrNodeContent={saveRrNodeContent}
        />
      ))}
    </Tabs>
  );
}
