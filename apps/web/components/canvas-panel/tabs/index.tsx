import { useState } from "react";
import { TabsProps } from "./props";
import TabsList from "./tabs-list";
import TabPanel from "./tab-panel";

export function Tabs({
  tabs,
  activeTabId,
  onTabChange,
  onTabAdd,
  onTabRemove,
  onTabRename,
  renderTabContent,
  disableAdd = false,
  disableRemove = false,
  listClassName = "",
  panelClassName = "",
  activeTabClassName = "",
  editInputClassName = "",
}: TabsProps) {
  // 内部维护编辑状态（解耦：编辑状态仅在组件内部管理）
  const [editingTabId, setEditingTabId] = useState<string | null>(null);

  // 处理编辑确认
  const handleEditConfirm = async (tabId: string, newLabel: string) => {
    if (!newLabel.trim()) return;
    await onTabRename(tabId, newLabel.trim());
    setEditingTabId(null);
  };

  // 处理编辑取消
  const handleEditCancel = () => {
    setEditingTabId(null);
  };

  return (
    <div className="w-full flex flex-col">
      {/* 标签列表子组件（透传 props + 内部状态） */}
      <TabsList
        tabs={tabs}
        activeTabId={activeTabId}
        editingTabId={editingTabId}
        onTabClick={onTabChange}
        onTabDoubleClick={setEditingTabId}
        onTabRemove={onTabRemove}
        onTabAdd={onTabAdd}
        onEditConfirm={handleEditConfirm}
        onEditCancel={handleEditCancel}
        disableAdd={disableAdd}
        disableRemove={disableRemove}
        listClassName={listClassName}
        activeTabClassName={activeTabClassName}
        editInputClassName={editInputClassName}
      />

      {/* 内容面板子组件 */}
      <TabPanel
        activeTabId={activeTabId}
        renderTabContent={renderTabContent}
        panelClassName={panelClassName}
      />
    </div>
  );
}
