import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BaseDeleteDialog } from "@/components/dialogs";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TabItem } from "../props";
import TabEditInput from "../tab-edit-input";

interface SortableTabItemProps {
  tab: TabItem;
  activeTabId: string;
  editingTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabDoubleClick: (tabId: string) => void;
  onTabEditConfirm: (tabId: string, newLabel: string) => void;
  onEditCancel: () => void;
  onTabRemove: (tabId: string) => void;
  disableRemove?: boolean;
  activeTabClassName?: string;
  editInputClassName?: string;
}

export default function SortableTabItem({
  tab,
  activeTabId,
  editingTabId,
  onTabClick,
  onTabDoubleClick,
  onTabEditConfirm,
  onEditCancel,
  onTabRemove,
  disableRemove,
  activeTabClassName,
  editInputClassName,
}: SortableTabItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const isActive = tab.id === activeTabId;
  const isEditing = tab.id === editingTabId;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center h-10 border rounded-t-md shrink-0 max-w-50 ${
        isActive
          ? activeTabClassName || "bg-background border-b-background"
          : "bg-muted"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {isEditing ? (
        <TabEditInput
          initialValue={tab.label}
          onConfirm={(newLabel) => onTabEditConfirm(tab.id, newLabel)}
          onCancel={onEditCancel}
          className={
            editInputClassName ||
            "w-full h-full px-2 border-none focus:outline-none"
          }
        />
      ) : (
        <>
          {/* 拖拽把手区域 */}
          <div
            {...attributes}
            {...listeners}
            className="absolute left-1 w-4 h-full cursor-grab flex items-center justify-center rounded z-10"
            aria-label={`拖动标签 ${tab.label}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              className="text-muted-foreground opacity-50"
            >
              <circle cx="2" cy="2" r="1.5" />
              <circle cx="2" cy="6" r="1.5" />
              <circle cx="2" cy="10" r="1.5" />
              <circle cx="10" cy="2" r="1.5" />
              <circle cx="10" cy="6" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
            </svg>
          </div>
          <span
            className="px-2 py-1 flex-1 truncate cursor-pointer ml-5"
            onClick={() => onTabClick(tab.id)}
            onDoubleClick={() => onTabDoubleClick(tab.id)}
          >
            {tab.label}
          </span>
          <BaseDeleteDialog
            trigger={
              <AlertDialogTrigger asChild>
                <button
                  className="px-2 py-1 text-muted-foreground hover:text-destructive transition-colors"
                  disabled={disableRemove}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`删除标签 ${tab.label}`}
                >
                  <Cross2Icon />
                </button>
              </AlertDialogTrigger>
            }
            title={`确定删除 ${tab.label} 吗？`}
            description="删除后，将无法恢复。"
            onConfirm={() => onTabRemove(tab.id)}
          />
        </>
      )}
    </div>
  );
}
