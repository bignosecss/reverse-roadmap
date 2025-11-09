import { useEffect } from "react";
import useCanvasStore from "@/lib/stores/canvas";
import { RrNode } from "@/lib/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "../ui/spinner";
import { Tiptap } from "./tiptap";
import {
  useGetRrContentById,
  useUpdateRrContentById,
} from "@/hooks/use-rr-content";
import { CanvasState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";

const selector = (state: CanvasState) => ({
  curRrContentTab: state.curRrContentTab,
  setCurRrContentTab: state.setCurRrContentTab,
});

export function CanvasTabs({ currentRrNode }: { currentRrNode: RrNode }) {
  const { curRrContentTab, setCurRrContentTab } = useCanvasStore(
    useShallow(selector),
  );

  const {
    data: rrContent,
    isPending,
    isRefetching,
  } = useGetRrContentById(curRrContentTab ? curRrContentTab.rrContent : "");

  const { mutate: saveRrNodeContent } = useUpdateRrContentById(
    curRrContentTab ? curRrContentTab.rrContent : "",
  );

  useEffect(() => {
    if (currentRrNode) setCurRrContentTab(currentRrNode.content[0]!);
  }, [currentRrNode, setCurRrContentTab]);

  if (!curRrContentTab) {
    return (
      <div className="w-full, px-8 text-[var(--destructive)]">
        Current node has no contents
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={curRrContentTab.tabTitle}
      value={curRrContentTab.tabTitle}
    >
      <TabsList className="m-5">
        {currentRrNode.content.map((nodeContent) => (
          <TabsTrigger
            key={nodeContent.rrContent}
            value={nodeContent.tabTitle}
            onClick={() => setCurRrContentTab(nodeContent)}
          >
            {nodeContent.tabTitle}
          </TabsTrigger>
        ))}
      </TabsList>
      {currentRrNode.content.map((nodeContent) => (
        <TabsContent key={nodeContent.rrContent} value={nodeContent.tabTitle}>
          {curRrContentTab?.rrContent === nodeContent.rrContent &&
            (isPending || isRefetching ? (
              <div className="w-full p-5">
                <Spinner className="size-8 mx-auto" />
              </div>
            ) : (
              <Tiptap content={rrContent} onSave={saveRrNodeContent} />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
