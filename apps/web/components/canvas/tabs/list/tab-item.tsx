import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BaseDeleteDialog } from "@/components/dialogs";
import { Cross2Icon } from "@radix-ui/react-icons";
import { TabItem } from "../props";
import TabEditInput from "../tab-edit-input";

interface TabItemProps {
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

export default function TabItemComponent({
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
}: TabItemProps) {
  const isActive = tab.id === activeTabId;
  const isEditing = tab.id === editingTabId;

  return (
    <div
      className={`relative flex items-center h-10 border rounded-t-md ${
        isActive
          ? activeTabClassName || "bg-background border-b-background"
          : "bg-muted"
      }`}
      style={{ width: "130px" }}
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
          <span
            className="px-2 py-1 flex-1 truncate cursor-pointer"
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
