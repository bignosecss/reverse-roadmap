import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import useFlowStore from "@/lib/stores/flow";
import { RrNode, NodeContent, RrContent } from "@/lib/types/models";
import { useUpdateRrContentForNode } from "@/hooks/use-rr-node";
import { UpdateRrContentTabDto } from "@/lib/types/apiRequests";

export function useTabRename(currentRrNode: RrNode | null) {
  const params = useParams();
  const treeId = params.id as string;
  const queryClient = useQueryClient();

  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);

  const { mutate: updateRrContent, isPending: isRrContentTabUpdating } =
    useUpdateRrContentForNode(currentRrNode?._id || "");

  const [editingState, setEditingState] = useState({
    editingTab: false,
    editingTabId: "",
    editingTabValue: "",
  });

  const startEditing = useCallback((targetTab: NodeContent) => {
    setEditingState({
      editingTab: true,
      editingTabId: targetTab.rrContent,
      editingTabValue: targetTab.tabTitle,
    });
  }, []);

  const stopEditing = useCallback(() => {
    setEditingState((prev) => ({
      ...prev,
      editingTab: false,
    }));
  }, []);

  const updateTabValue = useCallback((value: string) => {
    setEditingState((prev) => ({
      ...prev,
      editingTabValue: value,
    }));
  }, []);

  const handleRenameTab = useCallback(
    (updateRrContentTabDto: UpdateRrContentTabDto) => {
      if (!currentRrNode) return;

      updateRrContent(updateRrContentTabDto, {
        onSuccess: (data: { node: RrNode; content: RrContent }) => {
          stopEditing();
          setCurrentRrNode(data.node);
          queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
          toast.success("Content Tab Title 更新成功", {
            description: `成功更新节点 ${data.node.title} content ${data.content._id} 的 tab title`,
          });
        },
      });
    },
    [
      currentRrNode,
      queryClient,
      treeId,
      setCurrentRrNode,
      updateRrContent,
      stopEditing,
    ],
  );

  return {
    editingState,
    isRrContentTabUpdating,
    startEditing,
    stopEditing,
    updateTabValue,
    handleRenameTab,
  };
}
