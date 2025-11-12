import { useCallback, useEffect, useRef, useState } from "react";
import useCanvasStore from "@/lib/stores/canvas";
import { NodeContent, RrContent, RrNode } from "@/lib/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "../ui/spinner";
import { Tiptap } from "./tiptap";
import { Button } from "../ui/button";
import {
  useGetRrContentById,
  useUpdateRrContentById,
} from "@/hooks/use-rr-content";
import {
  useCreateRrContentForNode,
  useRemoveRrContentForNode,
  useUpdateRrContentForNode,
} from "@/hooks/use-rr-node";
import { CanvasState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import useFlowStore from "@/lib/stores/flow";
import { Input } from "../ui/input";
import { UpdateRrContentTabDto } from "@/lib/types/apiRequests";

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
  const { mutate: removeRrContent } = useRemoveRrContentForNode();
  const { mutate: updateRrContent, isPending: isRrContentTabUpdating } =
    useUpdateRrContentForNode(currentRrNode._id);
  const queryClient = useQueryClient();
  const prevRrContentTab = useRef("");

  const handleCreateRrContentForNode = useCallback(
    (nodeId: string) => {
      createRrContentForNode(nodeId, {
        onSuccess: (data: { node: RrNode; content: RrContent }) => {
          setCurrentRrNode(data.node);
          setSelectedRrContentTab(data.content._id);
          queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
          toast.success("Content 创建成功", {
            description: `成功为节点 ${data.node.title} 创建 content ${data.content.tabTitle}`,
          });
        },
      });
    },
    [
      queryClient,
      treeId,
      createRrContentForNode,
      setCurrentRrNode,
      setSelectedRrContentTab,
    ],
  );

  const handleRemoveRrContent = useCallback(
    (nodeId: string, contentId: string) => {
      removeRrContent(
        { nodeId, contentId },
        {
          onSuccess: (data: { node: RrNode; content: RrContent }) => {
            setCurrentRrNode(data.node);
            queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
            toast.success("Content 删除成功", {
              description: `成功为节点 ${data.node._id} 删除 content ${data.content._id}`,
            });
          },
        },
      );
    },
    [queryClient, treeId, removeRrContent, setCurrentRrNode],
  );

  const handleUpdateRrContentTab = useCallback(
    (updateRrContentTabDto: UpdateRrContentTabDto) => {
      updateRrContent(updateRrContentTabDto, {
        onSuccess: (data: { node: RrNode; content: RrContent }) => {
          setEditingTab(false);
          setCurrentRrNode(data.node);
          queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
          toast.success("Content Tab Title 更新成功", {
            description: `成功更新节点 ${data.node.title} content ${data.content._id} 的 tab title`,
          });
        },
      });
    },
    [queryClient, treeId, setCurrentRrNode, updateRrContent],
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

  const [editingTab, setEditingTab] = useState(false);
  const [editingTabId, setEditingTabId] = useState("");
  const [editingTabValue, setEditingTabValue] = useState("");

  const handleTabDoubleClick = useCallback(
    (targetTab: NodeContent) => {
      if (targetTab.rrContent !== selectedRrContentTab) return;
      setEditingTabValue(targetTab.tabTitle);
      setEditingTabId(targetTab.rrContent);
      setEditingTab(true);
    },
    [selectedRrContentTab],
  );

  // Keynote: useEffect 的回调函数总是在组件渲染并提交到 DOM 之后才运行。
  useEffect(() => {
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
      key={currentRrNode._id}
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
              className="group relative pr-7"
              onDoubleClick={() => handleTabDoubleClick(nodeContent)}
            >
              {editingTab && editingTabId === nodeContent.rrContent ? (
                <Input
                  type="text"
                  autoFocus
                  value={editingTabValue}
                  onChange={(e) => {
                    setEditingTabValue(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setEditingTab(false);
                    }
                    if (e.key === "Enter") {
                      handleUpdateRrContentTab({
                        rrContent: nodeContent.rrContent,
                        tabTitle: editingTabValue,
                      } as UpdateRrContentTabDto);
                    }
                  }}
                  onBlur={() => setEditingTab(false)}
                  disabled={isRrContentTabUpdating}
                />
              ) : (
                nodeContent.tabTitle
              )}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveRrContent(
                    currentRrNode._id,
                    nodeContent.rrContent,
                  );
                }}
              >
                <span>
                  <Cross2Icon className="h-3 w-3" />
                </span>
              </Button>
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
