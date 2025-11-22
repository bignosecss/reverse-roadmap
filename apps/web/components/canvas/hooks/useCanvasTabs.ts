import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import useCanvasStore from "@/lib/stores/canvas";
import useFlowStore from "@/lib/stores/flow";
import { RrNode, RrContent, CanvasState } from "@/lib/types/models";
import {
  useCreateRrContentForNode,
  useRemoveRrContentForNode,
} from "@/hooks/use-rr-node";

const selector = (state: CanvasState) => ({
  selectedRrContentTab: state.selectedRrContentTab,
  setSelectedRrContentTab: state.setSelectedRrContentTab,
});

export function useCanvasTabs(currentRrNode: RrNode) {
  const params = useParams();
  const treeId = params.id as string;
  const queryClient = useQueryClient();

  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);
  const { selectedRrContentTab, setSelectedRrContentTab } = useCanvasStore(
    useShallow(selector),
  );

  const { mutate: createRrContentForNode, isPending: isCreatingRrContentTab } =
    useCreateRrContentForNode();
  const { mutate: removeRrContent, isPending: isRemovingRrContentTab } =
    useRemoveRrContentForNode();

  const prevRrContentTab = useRef("");

  const handleCreateRrContent = useCallback(() => {
    createRrContentForNode(currentRrNode._id, {
      onSuccess: (data: { node: RrNode; content: RrContent }) => {
        setCurrentRrNode(data.node);
        setSelectedRrContentTab(data.content._id);
        prevRrContentTab.current = data.content._id;
        queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
        toast.success("Content 创建成功", {
          description: `成功为节点 ${data.node.title} 创建 content ${data.content.tabTitle}`,
        });
      },
    });
  }, [
    createRrContentForNode,
    currentRrNode._id,
    queryClient,
    setCurrentRrNode,
    setSelectedRrContentTab,
    treeId,
  ]);

  const handleRemoveRrContent = useCallback(
    (contentId: string) => {
      removeRrContent(
        { nodeId: currentRrNode._id, contentId },
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
    [currentRrNode._id, queryClient, removeRrContent, setCurrentRrNode, treeId],
  );

  const handleSelectRrContent = useCallback(
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

  useEffect(() => {
    if (currentRrNode.content.length <= 0) {
      setSelectedRrContentTab("");
      return;
    }

    const isFlowNodeChanged = !currentRrNode.content.some(
      (nodeContent) => nodeContent.rrContent === selectedRrContentTab,
    );
    if (isFlowNodeChanged) {
      const firstContentId = currentRrNode.content[0]!.rrContent;
      queryClient.invalidateQueries({
        queryKey: ["rrContent", selectedRrContentTab],
      });
      setSelectedRrContentTab(firstContentId);
      prevRrContentTab.current = firstContentId;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRrNode, queryClient, setSelectedRrContentTab]);

  return {
    selectedRrContentTab,
    handleCreateRrContent,
    isCreatingRrContentTab,
    handleRemoveRrContent,
    isRemovingRrContentTab,
    handleSelectRrContent,
  };
}
