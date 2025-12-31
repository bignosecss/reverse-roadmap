import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useCanvasStore from "@/lib/stores/canvas";
import { CanvasState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { RrNode } from "@repo/shared/models";

const selector = (state: CanvasState) => ({
  selectedRrContentTab: state.selectedRrContentTab,
  setSelectedRrContentTab: state.setSelectedRrContentTab,
});

export function useTabSelection(currentRrNode: RrNode | null) {
  const queryClient = useQueryClient();
  const { selectedRrContentTab, setSelectedRrContentTab } = useCanvasStore(
    useShallow(selector),
  );

  const prevRrContentTab = useRef("");

  const handleSelectTab = useCallback(
    (contentId: string) => {
      if (prevRrContentTab.current && prevRrContentTab.current !== contentId) {
        queryClient.invalidateQueries({
          queryKey: ["rrContent", prevRrContentTab.current],
        });
      }
      setSelectedRrContentTab(contentId);
      prevRrContentTab.current = contentId;
    },
    [queryClient, setSelectedRrContentTab],
  );

  useEffect(() => {
    if (!currentRrNode || currentRrNode.content.length <= 0) {
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
    handleSelectTab,
  };
}
