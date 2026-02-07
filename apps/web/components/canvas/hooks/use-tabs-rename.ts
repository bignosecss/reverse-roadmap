import { RrNode, UpdateRrContentTabDto } from "@repo/shared";
import { useCallback } from "react";
import { TabItem } from "../tabs/props";
import { toast } from "sonner";
import { useUpdateRrContentForNode } from "@/hooks/use-rr-node";
import { useQueryClient } from "@tanstack/react-query";
import { useTreeId } from "@/hooks/use-tree-id";

export function useTabsRename(currentRrNode: RrNode | null) {
  const treeId = useTreeId();
  const queryClient = useQueryClient();

  const { mutateAsync: updateRrContentTabAsync } = useUpdateRrContentForNode(
    currentRrNode ? currentRrNode._id : "",
  );

  const renameTab = useCallback(
    async (
      tabId: string,
      newLabel: string,
      tabs: TabItem[],
      setTabs: React.Dispatch<React.SetStateAction<TabItem[]>>,
    ) => {
      try {
        await updateRrContentTabAsync({
          rrContent: tabId,
          tabTitle: newLabel,
        } as UpdateRrContentTabDto);
        setTabs(
          tabs.map((tab) =>
            tab.id === tabId ? { ...tab, label: newLabel } : tab,
          ),
        );
        toast.success("Content 重命名成功", {
          description: `成功重命名标签页内容`,
        });
        queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
      } catch (err) {
        toast.error("重命名 Content 失败", {
          description: err instanceof Error ? err.message : "未知错误",
        });
      }
    },
    [updateRrContentTabAsync, queryClient, treeId],
  );

  return { renameTab };
}
