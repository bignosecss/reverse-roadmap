import { TabsList } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  useTabAddition,
  useTabRemoval,
  useTabRename,
  useActiveRrContent,
} from "../hooks";
import { EditableTabTrigger } from "./editable-tab-trigger";
import useSidebarStore from "@/lib/stores/sidebar";
import { RrNode, RrRootStatus } from "@repo/shared/models";

interface TabsManagerProps {
  currentRrNode: RrNode;
  selectedRrContentTab: string;
  onSelectTab: (contentId: string) => void;
}

export function TabsManager({
  currentRrNode,
  selectedRrContentTab,
  onSelectTab: handleSelectTab,
}: TabsManagerProps) {
  const mode = useSidebarStore((state) => state.mode);

  const { handleAddTab, isCreatingRrContentTab } =
    useTabAddition(currentRrNode);
  const { handleRemoveTab, isRemovingRrContentTab } =
    useTabRemoval(currentRrNode);
  const {
    editingState,
    isRrContentTabUpdating,
    startEditing,
    stopEditing,
    updateTabValue,
    handleRenameTab,
  } = useTabRename(currentRrNode);

  const isAnyOperationPending =
    isCreatingRrContentTab || isRemovingRrContentTab || isRrContentTabUpdating;

  const { rrContent } = useActiveRrContent(selectedRrContentTab);

  return (
    <>
      <div
        className="p-5 flex flex-row items-center max-w-full overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <TabsList className="flex">
          {currentRrNode.content.map((nodeContent) => {
            return (
              <EditableTabTrigger
                key={nodeContent.rrContent}
                mode={mode}
                tabData={{
                  nodeContent,
                  rrContent,
                  isSelected: selectedRrContentTab === nodeContent.rrContent,
                  shouldDisable: isAnyOperationPending,
                  isUpdating: isRrContentTabUpdating,
                }}
                editing={{
                  editingState,
                  onStartEditing: startEditing,
                  onStopEditing: stopEditing,
                  onUpdateValue: updateTabValue,
                  onFinishEditing: handleRenameTab,
                }}
                operations={{
                  onRemove: handleRemoveTab,
                  onSelect: handleSelectTab,
                }}
              />
            );
          })}
        </TabsList>
        {mode === RrRootStatus.private && !isAnyOperationPending && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleAddTab}
          >
            <PlusIcon className="size-4" />
          </Button>
        )}
      </div>
    </>
  );
}
