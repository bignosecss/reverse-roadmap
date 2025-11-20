import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import useFlowStore from "@/lib/stores/flow";
import { RrNode, RrContent, NodeContent } from "@/lib/types/models";
import { useUpdateRrContentForNode } from "@/hooks/use-rr-node";
import { UpdateRrContentTabDto } from "@/lib/types/apiRequests";

export function useTabEditing(currentRrNode: RrNode) {
  const params = useParams();
  const treeId = params.id as string;
  const queryClient = useQueryClient();

  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);

  const { mutate: updateRrContent, isPending: isRrContentTabUpdating } =
    useUpdateRrContentForNode(currentRrNode._id);

  const [editingTab, setEditingTab] = useState(false);
  const [editingTabId, setEditingTabId] = useState("");
  const [editingTabValue, setEditingTabValue] = useState("");

  const handleTabDoubleClick = useCallback(
    (targetTab: NodeContent, selectedRrContentTab: string) => {
      if (targetTab.rrContent !== selectedRrContentTab) return;
      setEditingTabValue(targetTab.tabTitle);
      setEditingTabId(targetTab.rrContent);
      setEditingTab(true);
    },
    [],
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

  return {
    editingState: { editingTab, editingTabId, editingTabValue },
    isRrContentTabUpdating,
    handleTabDoubleClick,
    handleUpdateRrContentTab,
    setEditingTabValue,
    setEditingTab,
  };
}
