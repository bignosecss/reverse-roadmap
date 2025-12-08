import { RrNode, RrRootStatus } from "@/lib/types/models";
import { TabsList } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useCanvasTabs } from "../hooks/useCanvasTabs";
import { useTabEditing } from "../hooks/useTabEditing";
import { EditableTabTrigger } from "./editable-tab-trigger";
import useSidebarStore from "@/lib/stores/sidebar";

interface TabsManagerProps {
  currentRrNode: RrNode;
}

export function TabsManager({ currentRrNode }: TabsManagerProps) {
  const mode = useSidebarStore((state) => state.mode);

  const {
    selectedRrContentTab,
    handleCreateRrContent,
    isCreatingRrContentTab,
    handleRemoveRrContent,
    isRemovingRrContentTab,
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

  return (
    <>
      <div
        className="p-5 flex flex-row items-center max-w-full overflow-scroll"
        style={{ scrollbarWidth: "none" }}
      >
        <TabsList>
          {currentRrNode.content.map((nodeContent) => (
            <EditableTabTrigger
              mode={mode}
              key={nodeContent.rrContent}
              nodeContent={nodeContent}
              rrContent={undefined} // Will be fetched by the component if needed
              selectedRrContentTab={selectedRrContentTab}
              editingState={editingState}
              isCreatingRrContentTab={isCreatingRrContentTab}
              isRemovingRrContentTab={isRemovingRrContentTab}
              isRrContentTabUpdating={isRrContentTabUpdating}
              handleTabDoubleClick={handleTabDoubleClick}
              setEditingTabValue={setEditingTabValue}
              setEditingTab={setEditingTab}
              handleUpdateRrContentTab={handleUpdateRrContentTab}
              handleRemoveRrContent={handleRemoveRrContent}
            />
          ))}
        </TabsList>
        {mode === RrRootStatus.private &&
          !(
            isCreatingRrContentTab ||
            isRemovingRrContentTab ||
            isRrContentTabUpdating
          ) && (
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
    </>
  );
}