import { NodeContent, RrNode } from "@repo/shared";
import { useCallback } from "react";
import { TabItem } from "../tabs/props";
import { toast } from "sonner";
import { useCreateRrContentForNode } from "@/hooks/use-rr-node";
import { useQueryClient } from "@tanstack/react-query";
import { useTreeId } from "@/hooks/use-tree-id";

export function useTabsAdd(currentRrNode: RrNode | null) {
  const treeId = useTreeId();
  const queryClient = useQueryClient();

  const { mutateAsync: createRrContentTabAsync } = useCreateRrContentForNode();

  const addTab = useCallback(
    async (
      setTabs: React.Dispatch<React.SetStateAction<TabItem[]>>,
      setActiveTabId: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      try {
        const response = await createRrContentTabAsync(currentRrNode!._id);

        const latestContent: NodeContent | undefined =
          response.node.content[response.node.content.length - 1];
        if (!latestContent) {
          toast.info("创建的内容项为空");
          throw new Error("创建的内容项为空");
        }

        const newTab: TabItem = {
          id: latestContent.rrContent,
          label: latestContent.tabTitle,
        };

        setTabs((prevTabs) => [...prevTabs, newTab]);
        setActiveTabId(newTab.id);

        toast.success("Content 创建成功", {
          description: `成功为节点 ${response.node.title} 创建 content`,
        });
        queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
      } catch (err) {
        toast.error("创建 Content 失败", {
          description: err instanceof Error ? err.message : "未知错误",
        });
      }
    },
    [createRrContentTabAsync, currentRrNode, queryClient, treeId],
  );

  return { addTab };
}
