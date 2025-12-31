import { NodeContent, RrNode, UpdateRrContentTabDto } from "@repo/shared";
import { useCallback, useEffect, useState } from "react";
import { TabItem } from "../tabs/props";
import { toast } from "sonner";
import {
  useCreateRrContentForNode,
  useRemoveRrContentForNode,
  useUpdateRrContentForNode,
} from "@/hooks/use-rr-node";
import { useQueryClient } from "@tanstack/react-query";
import { useTreeId } from "@/hooks/use-tree-id";

export default function useTabs(currentRrNode: RrNode | null) {
  // 初始化 Tab 数据
  const [tabs, setTabs] = useState<TabItem[]>([]);
  // 激活 Tab 状态
  const [activeTabId, setActiveTabId] = useState(
    tabs.length > 0 ? tabs[0]!.id : "",
  );

  const treeId = useTreeId();
  const queryClient = useQueryClient();

  // 通用的使树缓存失效函数
  const invalidateTree = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
  }, [queryClient, treeId]);

  const { mutateAsync: createRrContentTabAsync } = useCreateRrContentForNode();
  const addTab = useCallback(async () => {
    try {
      // 调用 API 创建新的内容
      const response = await createRrContentTabAsync(currentRrNode!._id);

      // 获取最新创建的内容项（应该是数组的最后一项）
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
      invalidateTree();
    } catch (err) {
      toast.error("创建 Content 失败", {
        description: err instanceof Error ? err.message : "未知错误",
      });
    }
  }, [createRrContentTabAsync, currentRrNode, invalidateTree]);

  const { mutateAsync: removeRrContentTabAsync } = useRemoveRrContentForNode();
  const removeTab = useCallback(
    async (tabId: string) => {
      try {
        await removeRrContentTabAsync({
          nodeId: currentRrNode!._id,
          contentId: tabId,
        });
        const newTabs = tabs.filter((tab) => tab.id !== tabId);
        setTabs(newTabs);
        // 若删除的是激活 Tab，切换到第一个 Tab
        if (activeTabId === tabId && newTabs.length > 0) {
          setActiveTabId(newTabs[0]!.id);
        }
        toast.success("Content 删除成功", {
          description: `成功删除标签页内容`,
        });
        invalidateTree();
      } catch (err) {
        toast.error("删除 Content 失败", {
          description: err instanceof Error ? err.message : "未知错误",
        });
      }
    },
    [
      currentRrNode,
      removeRrContentTabAsync,
      tabs,
      activeTabId,
      setActiveTabId,
      invalidateTree,
    ],
  );

  const { mutateAsync: updateRrContentTabAsync } = useUpdateRrContentForNode(
    currentRrNode ? currentRrNode._id : "",
  );
  const renameTab = useCallback(
    async (tabId: string, newLabel: string) => {
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
        invalidateTree();
      } catch (err) {
        toast.error("重命名 Content 失败", {
          description: err instanceof Error ? err.message : "未知错误",
        });
      }
    },
    [tabs, updateRrContentTabAsync, invalidateTree],
  );

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
  };
}
