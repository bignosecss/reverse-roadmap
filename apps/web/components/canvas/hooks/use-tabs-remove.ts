import { RrNode } from "@repo/shared";
import { useCallback } from "react";
import { TabItem } from "../tabs/props";
import { toast } from "sonner";
import { useRemoveRrContentForNode } from "@/hooks/use-rr-node";
import { useQueryClient } from "@tanstack/react-query";
import { useTreeId } from "@/hooks/use-tree-id";

export function useTabsRemove(currentRrNode: RrNode | null) {
  const treeId = useTreeId();
  const queryClient = useQueryClient();

  const { mutateAsync: removeRrContentTabAsync } = useRemoveRrContentForNode();

  const removeTab = useCallback(
    async (
      tabId: string,
      tabs: TabItem[],
      setTabs: React.Dispatch<React.SetStateAction<TabItem[]>>,
      activeTabId: string,
      setActiveTabId: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      try {
        await removeRrContentTabAsync({
          nodeId: currentRrNode!._id,
          contentId: tabId,
        });
        const newTabs = tabs.filter((tab) => tab.id !== tabId);
        setTabs(newTabs);
        if (activeTabId === tabId && newTabs.length > 0) {
          setActiveTabId(newTabs[0]!.id);
        }
        toast.success("Content 删除成功", {
          description: `成功删除标签页内容`,
        });
        queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
      } catch (err) {
        toast.error("删除 Content 失败", {
          description: err instanceof Error ? err.message : "未知错误",
        });
      }
    },
    [currentRrNode, removeRrContentTabAsync, queryClient, treeId],
  );

  return { removeTab };
}
