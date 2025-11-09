"use client";

import useFlowStore from "@/lib/stores/flow";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";
import { CanvasState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { Tiptap } from "./tiptap";
import { cn } from "@/lib/utils";
import {
  useGetRrContentById,
  useUpdateRrContentById,
} from "@/hooks/use-rr-content";
import useCanvasStore from "@/lib/stores/canvas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const selector = (state: CanvasState) => ({
  canvasOpen: state.canvasOpen,
  savingContent: state.savingContent,
  curRrContentTab: state.curRrContentTab,
  setCanvasOpen: state.setCanvasOpen,
  setCurRrContentTab: state.setCurRrContentTab,
});

export function Canvas() {
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const {
    canvasOpen,
    savingContent,
    curRrContentTab,
    setCanvasOpen,
    setCurRrContentTab,
  } = useCanvasStore(useShallow(selector));

  const {
    data: rrContent,
    isPending,
    isRefetching,
  } = useGetRrContentById(curRrContentTab ? curRrContentTab.rrContent : "");

  const { mutate: saveRrNodeContent } = useUpdateRrContentById(
    curRrContentTab ? curRrContentTab.rrContent : "",
  );

  if (!currentRrNode || !canvasOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "md:border-l bg-background flex flex-1 flex-col overflow-y-auto",
        "fixed z-20 inset-0", // 在小屏幕下 Canvas 占据整个屏幕
        "md:static md:w-[50vw]",
        "md:shadow-[0_0_18px_var(--border)]",
        { block: canvasOpen, hidden: !canvasOpen },
      )}
      style={{ scrollbarWidth: "none" }}
    >
      <header
        className={cn(
          "@container touch:px-2.5 h-13 flex flex-none items-center gap-1 px-2",
          "sticky top-0 bg-background z-10",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCanvasOpen(false)}
        >
          <X />
        </Button>
        <span>{currentRrNode.title}</span>
        {savingContent && (
          <Badge variant="outline" className="ml-1">
            <Spinner />
            Saving...
          </Badge>
        )}
      </header>

      <section>
        {!!currentRrNode.description && (
          <div className="w-full h-fit flex flex-row justify-center py-8 px-4">
            <div className="min-w-1/3 max-w-4/5 h-fit">
              <blockquote className="border-l-2 pl-6 italic max-h-fit">
                {currentRrNode.description}
              </blockquote>
            </div>
          </div>
        )}

        {
          <main className="w-full px-8">
            <Tabs defaultValue="account">
              <TabsList className="m-5">
                {!!currentRrNode &&
                  currentRrNode.content &&
                  currentRrNode.content.length > 0 &&
                  currentRrNode.content.map((nodeContent) => (
                    <TabsTrigger
                      key={nodeContent.rrContent}
                      value={nodeContent.tabTitle}
                      onClick={() => setCurRrContentTab(nodeContent)}
                    >
                      {nodeContent.tabTitle}
                    </TabsTrigger>
                  ))}
              </TabsList>
              <TabsContent value={curRrContentTab?.tabTitle || "content"}>
                {isPending || isRefetching ? (
                  <div className="w-full p-5">
                    <Spinner className="size-8 mx-auto" />
                  </div>
                ) : (
                  <Tiptap content={rrContent} onSave={saveRrNodeContent} />
                )}
              </TabsContent>
            </Tabs>
          </main>
        }
      </section>
    </div>
  );
}
