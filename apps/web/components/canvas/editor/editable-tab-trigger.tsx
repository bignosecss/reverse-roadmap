import { useCallback } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { NodeContent, RrRootStatus } from "@/lib/types/models";
import { UpdateRrContentTabDto } from "@/lib/types/apiRequests";
import { TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditableTabTriggerProps {
  mode: RrRootStatus;
  nodeContent: NodeContent;
  selectedRrContentTab: string;
  editingState: {
    editingTab: boolean;
    editingTabId: string;
    editingTabValue: string;
  };
  isCreatingRrContentTab: boolean;
  isRemovingRrContentTab: boolean;
  isRrContentTabUpdating: boolean;
  handleTabDoubleClick: (
    targetTab: NodeContent,
    selectedRrContentTab: string,
  ) => void;
  setEditingTabValue: (value: string) => void;
  setEditingTab: (isEditing: boolean) => void;
  handleUpdateRrContentTab: (dto: UpdateRrContentTabDto) => void;
  handleRemoveRrContent: (contentId: string) => void;
}

export function EditableTabTrigger({
  mode,
  nodeContent,
  selectedRrContentTab,
  editingState,
  isCreatingRrContentTab,
  isRemovingRrContentTab,
  isRrContentTabUpdating,
  handleTabDoubleClick,
  setEditingTabValue,
  setEditingTab,
  handleUpdateRrContentTab,
  handleRemoveRrContent,
}: EditableTabTriggerProps) {
  const { editingTab, editingTabId, editingTabValue } = editingState;
  const isEditingThisTab = editingTab && editingTabId === nodeContent.rrContent;

  const handleEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingTab(false);
      }
      if (e.key === "Enter") {
        handleUpdateRrContentTab({
          rrContent: nodeContent.rrContent,
          tabTitle: editingTabValue,
        } as UpdateRrContentTabDto);
      }
    },
    [
      editingTabValue,
      handleUpdateRrContentTab,
      nodeContent.rrContent,
      setEditingTab,
    ],
  );

  return (
    <TabsTrigger
      key={nodeContent.rrContent}
      value={nodeContent.rrContent}
      className="group relative pr-7"
      onDoubleClick={() => {
        if (mode === RrRootStatus.private)
          handleTabDoubleClick(nodeContent, selectedRrContentTab);
      }}
    >
      {isEditingThisTab ? (
        <Input
          type="text"
          autoFocus
          value={editingTabValue}
          onChange={(e) => setEditingTabValue(e.target.value)}
          onKeyDown={handleEnter}
          onBlur={() => setEditingTab(false)}
          disabled={isRrContentTabUpdating}
        />
      ) : (
        nodeContent.tabTitle
      )}
      {mode === RrRootStatus.private &&
        !(
          isCreatingRrContentTab ||
          isRemovingRrContentTab ||
          isRrContentTabUpdating
        ) && (
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveRrContent(nodeContent.rrContent);
            }}
          >
            <span>
              <Cross2Icon className="h-3 w-3" />
            </span>
          </Button>
        )}
    </TabsTrigger>
  );
}
