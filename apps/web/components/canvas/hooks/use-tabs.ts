import { NodeContent, RrNode } from "@repo/shared";
import { useEffect, useState } from "react";
import { TabItem } from "../tabs/props";
import { useTabsAdd } from "./use-tabs-add";
import { useTabsRemove } from "./use-tabs-remove";
import { useTabsRename } from "./use-tabs-rename";
import { useTabsReorder } from "./use-tabs-reorder";

export default function useTabs(currentRrNode: RrNode | null) {
  // 初始化 Tab 数据
  const [tabs, setTabs] = useState<TabItem[]>([]);
  // 激活 Tab 状态
  const [activeTabId, setActiveTabId] = useState(
    tabs.length > 0 ? tabs[0]!.id : "",
  );

  const { addTab: addTabImpl } = useTabsAdd(currentRrNode);
  const { removeTab: removeTabImpl } = useTabsRemove(currentRrNode);
  const { renameTab: renameTabImpl } = useTabsRename(currentRrNode);
  const { reorderTab: reorderTabImpl } = useTabsReorder(currentRrNode);

  const addTab = async () => {
    await addTabImpl(setTabs, setActiveTabId);
  };

  const removeTab = async (tabId: string) => {
    await removeTabImpl(tabId, tabs, setTabs, activeTabId, setActiveTabId);
  };

  const renameTab = async (tabId: string, newLabel: string) => {
    await renameTabImpl(tabId, newLabel, tabs, setTabs);
  };

  const reorderTab = async (oldIndex: number, newIndex: number) => {
    await reorderTabImpl(oldIndex, newIndex, tabs, setTabs);
  };

  useEffect(() => {
    if (!currentRrNode) return;

    const currentTabs = currentRrNode.content.map(
      (content: NodeContent) =>
        ({
          id: content.rrContent,
          label: content.tabTitle,
        }) as TabItem,
    );

    setTabs(currentTabs);
    setActiveTabId(currentTabs.length > 0 ? currentTabs[0]!.id : "");
  }, [currentRrNode]);

  return {
    tabs,
    activeTabId,
    setActiveTabId,
    addTab,
    removeTab,
    renameTab,
    reorderTab,
  };
}
