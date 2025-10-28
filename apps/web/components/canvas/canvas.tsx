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
  const currentRrNode = useFlowStore((state) => state.currentRrNode);
  const { canvasOpen, updatingContent, setCanvasOpen } = useCanvasStore(
    useShallow(selector),
  );

  const {
    data: rrNodeContent,
    isPending,
    isRefetching,
  } = useGetRrNodeContent(
    currentRrNode && currentRrNode.content ? currentRrNode.content : "",
  );
  const { mutate: saveRrNodeContent } = useUpdateRrNodeContent(
    rrNodeContent ? rrNodeContent._id : "",
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
        {updatingContent && (
          <Badge variant="outline" className="ml-1">
            <Spinner />
            Updating
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

        {/* 每次dataUpdatedAt都会变化，即使是缓存数据 */}
        {/* 当 key 改变时，React 会认为这是一个不同的元素，因此会销毁之前的组件实例并重新创建一个新的组件实例 */}
        {/* React Query 中，dataUpdatedAt 是请求成功返回数据的时间；绝大部分情况，每个节点的该字段都是不同的，所以满足了切换节点 tiptap 实例重新创建的需求 */}
        {/* 现在，React-Flow 组件中，在处理节点点击的时候，会将 React-Query 缓存的当前节点的 content invalidate，React-Query 会在后台自动 refetch */}
        {/* 这时，isRefetching 状态改变，所以当前利用该状态的改变来 trigger react re-render，而不使用 key */}
        {
          <main className="w-full px-8">
            {isPending || isRefetching ? (
              <div className="w-full p-5">
                <Spinner className="size-8 mx-auto" />
              </div>
            ) : (
              <Tiptap content={rrNodeContent} onSave={saveRrNodeContent} />
            )}
          </main>
        }
      </section>
    </div>
  );
}
