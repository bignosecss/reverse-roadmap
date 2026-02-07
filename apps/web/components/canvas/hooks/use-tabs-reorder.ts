import { NodeContent, RrNode } from "@repo/shared";
import { useCallback } from "react";
import { TabItem } from "../tabs/props";
import { toast } from "sonner";
import { useUpdateRrContentOrder } from "@/hooks/use-rr-node";
import { useQueryClient } from "@tanstack/react-query";
import { useTreeId } from "@/hooks/use-tree-id";

export function useTabsReorder(currentRrNode: RrNode | null) {
  const queryClient = useQueryClient();
  const treeId = useTreeId();

  const { mutateAsync: updateRrContentOrder } = useUpdateRrContentOrder();

  const reorderTab = useCallback(
    async (
      oldIndex: number,
      newIndex: number,
      tabs: TabItem[],
      setTabs: React.Dispatch<React.SetStateAction<TabItem[]>>,
    ) => {
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
    },
    [currentRrNode, queryClient, treeId, updateRrContentOrder],
  );

  return { reorderTab };
}
