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
  useGetRrNodeContent,
  useUpdateRrNodeContent,
} from "@/hooks/use-rr-node-content";
import useCanvasStore from "@/lib/stores/canvas";

const selector = (state: CanvasState) => ({
  canvasOpen: state.canvasOpen,
  updatingContent: state.updatingContent,
  setCanvasOpen: state.setCanvasOpen,
});

export function Canvas() {
  const currentNode = useFlowStore((state) => state.currentNode);
  const { canvasOpen, updatingContent, setCanvasOpen } = useCanvasStore(
    useShallow(selector),
  );

  const nodeContentId = currentNode?.content;
  const { data: nodeContent, dataUpdatedAt } = useGetRrNodeContent(
    nodeContentId ? nodeContentId : "",
  );
  const { mutate: saveContent } = useUpdateRrNodeContent(
    nodeContent ? nodeContent._id : "",
  );

  if (!currentNode || !canvasOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-20 inset-0 border-l bg-background flex flex-col overflow-y-auto",
        "md:static md:w-[50vw]",
        "shadow-[0_0_18px_rgba(0,0,0,0.12)] dark:shadow-[0_0_18px_rgba(0,0,0,0.48)]",
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
        <span>{currentNode.title}</span>
        {updatingContent && (
          <Badge variant="outline" className="ml-1">
            <Spinner />
            Updating
          </Badge>
        )}
      </header>

      <section>
        {!!currentNode.description && (
          <div className="w-full h-fit flex flex-row justify-center">
            <div className="min-w-1/3 max-w-4/5 h-fit py-4">
              <blockquote className="border-l-2 pl-6 italic max-h-fit">
                {currentNode.description}
              </blockquote>
            </div>
          </div>
        )}

        {/* 每次dataUpdatedAt都会变化，即使是缓存数据 */}
        {/* 当 key 改变时，React 会认为这是一个不同的元素，因此会销毁之前的组件实例并重新创建一个新的组件实例 */}
        {/* React Query 中，dataUpdatedAt 是请求成功返回数据的时间；绝大部分情况，每个节点的该字段都是不同的，所以满足了切换节点 tiptap 实例重新创建的需求 */}
        <main key={dataUpdatedAt} className="w-full px-8">
          <Tiptap content={nodeContent} onSave={saveContent} />
        </main>
      </section>
    </div>
  );
}
