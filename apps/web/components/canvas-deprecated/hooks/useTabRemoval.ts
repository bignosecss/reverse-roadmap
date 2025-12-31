import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import useFlowStore from "@/lib/stores/flow";
import { useRemoveRrContentForNode } from "@/hooks/use-rr-node";
import { RrContent, RrNode } from "@repo/shared/models";

export function useTabRemoval(currentRrNode: RrNode | null) {
  const params = useParams();
  const treeId = params.id as string;
  const queryClient = useQueryClient();

  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);

  const { mutate: removeRrContent, isPending: isRemovingRrContentTab } =
    useRemoveRrContentForNode();

  const handleRemoveTab = useCallback(
    (contentId: string) => {
      if (!currentRrNode) return;

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
    [currentRrNode, queryClient, removeRrContent, setCurrentRrNode, treeId],
  );

  return {
    handleRemoveTab,
    isRemovingRrContentTab,
  };
}
