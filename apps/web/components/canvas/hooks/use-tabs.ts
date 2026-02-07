import { NodeContent, RrNode } from "@repo/shared";
import { useEffect, useState } from "react";
import { TabItem } from "../tabs/props";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useTabsAdd } from "./use-tabs-add";
import { useTabsRemove } from "./use-tabs-remove";
import { useTabsRename } from "./use-tabs-rename";
import { useUpdateRrContentOrder } from "@/hooks/use-rr-node";
import { useTreeId } from "@/hooks/use-tree-id";

export default function useTabs(currentRrNode: RrNode | null) {
  // 初始化 Tab 数据
  const [tabs, setTabs] = useState<TabItem[]>([]);
  // 激活 Tab 状态
  const [activeTabId, setActiveTabId] = useState(
    tabs.length > 0 ? tabs[0]!.id : "",
  );

  const queryClient = useQueryClient();
  const treeId = useTreeId();

  const { addTab: addTabImpl } = useTabsAdd(currentRrNode);
  const { removeTab: removeTabImpl } = useTabsRemove(currentRrNode);
  const { renameTab: renameTabImpl } = useTabsRename(currentRrNode);
  const { mutateAsync: updateRrContentOrder } = useUpdateRrContentOrder();

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
    if (oldIndex === newIndex) return;

    // Save old state for potential revert
    const oldTabs = [...tabs];
    const newTabs = [...tabs];
    const [removed] = newTabs.splice(oldIndex, 1);
    newTabs.splice(newIndex, 0, removed!);

    setTabs(newTabs);

    if (!currentRrNode) return;

    // Map reordered tabs back to NodeContent[] format
    const orderedContent: NodeContent[] = newTabs.map(
      (tab) =>
        ({
          rrContent: tab.id,
          tabTitle: tab.label,
        }) as NodeContent,
    );

    try {
      await updateRrContentOrder({
        nodeId: currentRrNode._id,
        orderedContent,
      });
      toast.success("标签顺序更新成功", {
        description: `已更新节点 ${currentRrNode.title} 的标签顺序`,
      });
      queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
    } catch (err) {
      toast.error("更新标签顺序失败", {
        description: err instanceof Error ? err.message : "未知错误",
      });
      // Revert the local state on error
      setTabs(oldTabs);
    }
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
