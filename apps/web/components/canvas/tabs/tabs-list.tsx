import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BaseDeleteDialog } from "@/components/dialogs";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { TabItem, TabsListProps } from "./props";
import TabEditInput from "./tab-edit-input";

// 可排序的 Tab 项组件
function SortableTabItem({
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
}: {
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
}) {
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
    width: "130px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center h-10 border rounded-t-md ${
        isActive
          ? activeTabClassName || "bg-background border-b-background"
          : "bg-muted"
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {/* 编辑状态：显示输入框 */}
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
            className="absolute left-1 w-4 h-full cursor-grab flex items-center justify-center hover:bg-muted-foreground/10 rounded z-10"
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
          {/* 非编辑状态：显示标签文本 */}
          <span
            className="px-2 py-1 flex-1 truncate cursor-pointer ml-5"
            onClick={() => onTabClick(tab.id)}
            onDoubleClick={() => onTabDoubleClick(tab.id)}
          >
            {tab.label}
          </span>
          {/* 删除按钮 */}
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

export default function TabsList({
  tabs,
  activeTabId,
  editingTabId,
  onTabClick,
  onTabDoubleClick,
  onTabRemove,
  onTabAdd,
  onEditConfirm,
  onEditCancel,
  onTabReorder,
  disableAdd = false,
  disableRemove = false,
  listClassName = "",
  activeTabClassName = "",
  editInputClassName = "",
}: TabsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // 拖拽结束处理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !onTabReorder) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const oldIndex = tabs.findIndex((tab) => tab.id === activeId);
    const newIndex = tabs.findIndex((tab) => tab.id === overId);

    if (oldIndex !== -1 && newIndex !== -1) {
      onTabReorder(oldIndex, newIndex);
    }
  };

  // 非拖拽状态：显示原始列表
  if (!onTabReorder) {
    const renderTabItem = (tab: TabItem) => {
      const isActive = tab.id === activeTabId;
      const isEditing = tab.id === editingTabId;

      return (
        <div
          key={tab.id}
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
              onConfirm={(newLabel) => onEditConfirm(tab.id, newLabel)}
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
    };

    return (
      <div
        className={`flex items-center gap-1 overflow-x-auto ${listClassName}`}
      >
        {tabs.map(renderTabItem)}
        <button
          className="flex items-center justify-center w-10 h-10 border rounded-t-md bg-muted hover:bg-muted/50 transition-colors"
          onClick={onTabAdd}
          disabled={disableAdd}
          aria-label="新增标签"
        >
          <PlusIcon />
        </button>
      </div>
    );
  }

  // 拖拽排序状态
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <SortableContext
        items={tabs.map((tab) => tab.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div
          className={`flex items-center gap-1 overflow-x-auto ${listClassName}`}
        >
          {tabs.map((tab) => (
            <SortableTabItem
              key={tab.id}
              tab={tab}
              activeTabId={activeTabId}
              editingTabId={editingTabId}
              onTabClick={onTabClick}
              onTabDoubleClick={onTabDoubleClick}
              onTabEditConfirm={onEditConfirm}
              onEditCancel={onEditCancel}
              onTabRemove={onTabRemove}
              disableRemove={disableRemove}
              activeTabClassName={activeTabClassName}
              editInputClassName={editInputClassName}
            />
          ))}

          {/* 新增 Tab 按钮 */}
          <button
            className="flex items-center justify-center w-10 h-10 border rounded-t-md bg-muted hover:bg-muted/50 transition-colors"
            onClick={onTabAdd}
            disabled={disableAdd}
            aria-label="新增标签"
          >
            <PlusIcon />
          </button>
        </div>
      </SortableContext>
    </DndContext>
  );
}
