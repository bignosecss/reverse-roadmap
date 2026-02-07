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
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { TabsListProps } from "../props";
import SortableTabItem from "./sortable-tab-item";
import AddTabButton from "./add-tab-button";

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

  const tabItemProps = {
    activeTabId,
    editingTabId,
    onTabClick,
    onTabDoubleClick,
    onTabEditConfirm: onEditConfirm,
    onEditCancel,
    onTabRemove,
    disableRemove,
    activeTabClassName,
    editInputClassName,
  };

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
          className={`flex items-center gap-1 overflow-x-auto min-w-0 ${listClassName}`}
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((tab) => (
            <SortableTabItem key={tab.id} tab={tab} {...tabItemProps} />
          ))}
          <AddTabButton onClick={onTabAdd} disabled={disableAdd} />
        </div>
      </SortableContext>
    </DndContext>
  );
}
