import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { TabItem, TabsListProps } from "./props";
import TabEditInput from "./tab-edit-input";

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
  disableAdd = false,
  disableRemove = false,
  listClassName = "",
  activeTabClassName = "",
  editInputClassName = "",
}: TabsListProps) {
  // 单个 Tab 标签渲染
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
        style={{
          minWidth: "120px", // 保证标签最小宽度
        }}
      >
        {/* 编辑状态：显示输入框 */}
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
            {/* 非编辑状态：显示标签文本 */}
            <span
              className="px-2 py-1 flex-1 truncate cursor-pointer"
              onClick={() => onTabClick(tab.id)}
              onDoubleClick={() => onTabDoubleClick(tab.id)}
            >
              {tab.label}
            </span>
            {/* 删除按钮 */}
            <button
              className="px-2 py-1 text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => onTabRemove(tab.id)}
              disabled={disableRemove}
              aria-label={`删除标签 ${tab.label}`}
            >
              <Cross2Icon />
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-1 overflow-x-auto ${listClassName}`}>
      {/* 循环渲染 Tab 项 */}
      {tabs.map(renderTabItem)}

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
  );
}
