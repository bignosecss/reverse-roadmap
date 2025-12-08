import { useCallback } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { NodeContent, RrContent, RrRootStatus } from "@/lib/types/models";
import { UpdateRrContentTabDto } from "@/lib/types/apiRequests";
import { TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";

interface TabData {
  nodeContent: NodeContent;
  rrContent: RrContent | undefined;
  isSelected: boolean;
  shouldDisable: boolean;
  isUpdating: boolean;
}

interface Editing {
  editingState: {
    editingTab: boolean;
    editingTabId: string;
    editingTabValue: string;
  };
  onStartEditing: (nodeContent: NodeContent) => void;
  onUpdateValue: (value: string) => void;
  onFinishEditing: (dto: UpdateRrContentTabDto) => void;
}

interface Operations {
  onRemove: (contentId: string) => void;
  onSelect: (contentId: string) => void;
}

interface EditableTabTriggerProps {
  mode: RrRootStatus;
  tabData: TabData;
  editing: Editing;
  operations: Operations;
}

export function EditableTabTrigger({
  mode,
  tabData,
  editing,
  operations,
}: EditableTabTriggerProps) {
  const { nodeContent, rrContent, isSelected, shouldDisable, isUpdating } =
    tabData;
  const { editingState, onStartEditing, onUpdateValue, onFinishEditing } =
    editing;
  const { onRemove, onSelect } = operations;

  const isEditingThisTab =
    editingState.editingTab &&
    editingState.editingTabId === nodeContent.rrContent;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        // Cancel editing without saving
        onStartEditing(nodeContent); // This will stop editing by toggling
      }
      if (e.key === "Enter") {
        onFinishEditing({
          rrContent: nodeContent.rrContent,
          tabTitle: editingState.editingTabValue,
        } as UpdateRrContentTabDto);
      }
    },
    [
      editingState.editingTabValue,
      nodeContent,
      onFinishEditing,
      onStartEditing,
    ],
  );

  const handleDoubleClick = useCallback(() => {
    if (mode === RrRootStatus.private && isSelected) {
      onStartEditing(nodeContent);
    }
  }, [mode, isSelected, nodeContent, onStartEditing]);

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove(nodeContent.rrContent);
    },
    [nodeContent.rrContent, onRemove],
  );

  return (
    <TabsTrigger
      value={nodeContent.rrContent}
      className="group relative pr-7"
      onClick={() => onSelect(nodeContent.rrContent)}
      onDoubleClick={handleDoubleClick}
    >
      {isEditingThisTab ? (
        <Input
          type="text"
          autoFocus
          value={editingState.editingTabValue}
          onChange={(e) => onUpdateValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // On blur, finish editing with the current value
            onFinishEditing({
              rrContent: nodeContent.rrContent,
              tabTitle: editingState.editingTabValue,
            } as UpdateRrContentTabDto);
          }}
          disabled={isUpdating}
          className="min-w-16"
        />
      ) : (
        <Tooltip>
          <TooltipTrigger className="truncate max-w-[150px]">
            {nodeContent.tabTitle}
          </TooltipTrigger>
          <TooltipContent>{`上次修改时间：${rrContent?.updatedAt ? formatDate(rrContent.updatedAt) : ""}`}</TooltipContent>
        </Tooltip>
      )}
      {mode === RrRootStatus.private && !shouldDisable && (
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRemoveClick}
        >
          <span>
            <Cross2Icon className="h-3 w-3" />
          </span>
        </Button>
      )}
    </TabsTrigger>
  );
}
