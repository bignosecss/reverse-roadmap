import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import useFlowStore from "@/lib/stores/flow";
import { useCreateRrContentForNode } from "@/hooks/use-rr-node";
import { RrContent, RrNode } from "@repo/shared/models";

export function useTabAddition(currentRrNode: RrNode | null) {
  const params = useParams();
  const treeId = params.id as string;
  const queryClient = useQueryClient();

  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);

  const { mutate: createRrContentForNode, isPending: isCreatingRrContentTab } =
    useCreateRrContentForNode();

  const handleAddTab = useCallback(() => {
    if (!currentRrNode) return;

    createRrContentForNode(currentRrNode._id, {
      onSuccess: (data: { node: RrNode; content: RrContent }) => {
        setCurrentRrNode(data.node);
        queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
        toast.success("Content 创建成功", {
          description: `成功为节点 ${data.node.title} 创建 content`,
        });
      },
    });
  }, [
    createRrContentForNode,
    currentRrNode,
    queryClient,
    setCurrentRrNode,
    treeId,
  ]);

  return {
    handleAddTab,
    isCreatingRrContentTab,
  };
}
