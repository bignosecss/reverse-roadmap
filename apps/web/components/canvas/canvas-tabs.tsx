import { useCallback, useEffect, useRef } from "react";
import useCanvasStore from "@/lib/stores/canvas";
import { RrContent, RrNode } from "@/lib/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "../ui/spinner";
import { Tiptap } from "./tiptap";
import { Button } from "../ui/button";
import {
  useGetRrContentById,
  useUpdateRrContentById,
} from "@/hooks/use-rr-content";
import { CanvasState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { PlusIcon } from "@radix-ui/react-icons";
import { useCreateRrContentForNode } from "@/hooks/use-rr-node";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import useFlowStore from "@/lib/stores/flow";

const selector = (state: CanvasState) => ({
  selectedRrContentTab: state.selectedRrContentTab,
  setSelectedRrContentTab: state.setSelectedRrContentTab,
});

export function CanvasTabs({ currentRrNode }: { currentRrNode: RrNode }) {
  const params = useParams();
  const treeId = params.id as string;

  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);

  const { selectedRrContentTab, setSelectedRrContentTab } = useCanvasStore(
    useShallow(selector),
  );

  const {
    data: rrContent,
    isPending,
    isRefetching,
  } = useGetRrContentById(selectedRrContentTab ? selectedRrContentTab : "");

  const { mutate: saveRrNodeContent } = useUpdateRrContentById(
    selectedRrContentTab ? selectedRrContentTab : "",
  );

  const { mutate: createRrContentForNode } = useCreateRrContentForNode();
  const queryClient = useQueryClient();
  const prevRrContentTab = useRef("");

  const handleCreateRrContentForNode = useCallback(
    (nodeId: string) => {
      createRrContentForNode(nodeId, {
        onSuccess: (data: { node: RrNode; content: RrContent }) => {
          setCurrentRrNode(data.node);
          queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
          toast.success("Content 创建成功", {
            description: `成功为节点 ${data.node.title} 创建 content ${data.content.tabTitle}`,
          });
        },
      });
    },
    [queryClient, treeId, setCurrentRrNode, createRrContentForNode],
  );

  const handleTabsValueChange = useCallback(
    (currentRrContentTab: string) => {
      if (
        prevRrContentTab.current &&
        prevRrContentTab.current !== currentRrContentTab
      ) {
        queryClient.invalidateQueries({
          queryKey: ["rrContent", prevRrContentTab.current],
        });
      }
      setSelectedRrContentTab(currentRrContentTab);
      prevRrContentTab.current = currentRrContentTab;
    },
    [queryClient, setSelectedRrContentTab],
  );

  /**
   * Keynote: useEffect 的回调函数总是在组件渲染并提交到 DOM 之后才运行。
   * 这个模式（Prop Change -> Render 1 -> useEffect -> State Change -> Render 2）
   * 在 React 中非常常见，它被称为“将 props 同步到 state”。虽然会引起一次额外的渲染，
   * 但这通常是正确且必要的逻辑，以确保组件状态和外部数据保持一致。在大多数情况下，
   * 这种额外的渲染对性能的影响可以忽略不计，除非组件极其复杂。
   */
  useEffect(() => {
    // When the node changes, update the selected tab to its first content tab.
    const firstContentTab = currentRrNode.content[0]!.rrContent;
    setSelectedRrContentTab(firstContentTab);

    // 通过判断 zustand 中选中的当前 tab id 是否存在于 currentRrNode.content
    // 来判断是否切换了节点，因为 handleTabsValueChange 在初始化时不会执行
    const isFlowNodeChanged = !currentRrNode.content.some(
      (nodeContent) => nodeContent.rrContent === selectedRrContentTab,
    );
    if (isFlowNodeChanged) {
      queryClient.invalidateQueries({
        queryKey: ["rrContent", selectedRrContentTab],
      });
      setSelectedRrContentTab(currentRrNode.content[0]!.rrContent);
    }
    // selectedRrContentTab 不应该作为依赖项
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRrNode, queryClient, setSelectedRrContentTab]);

  if (!selectedRrContentTab) {
    return (
      <div className="w-full, px-8 text-[var(--destructive)]">
        Current node has no contents
      </div>
    );
  }

  return (
    <Tabs
      // The key ensures the Tabs component resets if the node fundamentally changes.
      // The value prop makes it a controlled component, which is updated by the useEffect.
      key={currentRrNode._id}
      defaultValue={currentRrNode.content[0]!.rrContent}
      value={selectedRrContentTab}
      onValueChange={(currentRrContentTab) =>
        handleTabsValueChange(currentRrContentTab)
      }
    >
      <div className="p-5 flex flex-row items-center">
        <TabsList>
          {currentRrNode.content.map((nodeContent) => (
            <TabsTrigger
              key={nodeContent.rrContent}
              value={nodeContent.rrContent}
            >
              {nodeContent.tabTitle}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => handleCreateRrContentForNode(currentRrNode._id)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      {currentRrNode.content.map((nodeContent) => (
        <TabsContent key={nodeContent.rrContent} value={nodeContent.rrContent}>
          {isPending || isRefetching ? (
            <div className="w-full p-5">
              <Spinner className="size-8 mx-auto" />
            </div>
          ) : (
            <Tiptap content={rrContent} onSave={saveRrNodeContent} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
