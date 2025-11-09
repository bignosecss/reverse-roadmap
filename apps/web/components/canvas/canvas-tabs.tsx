import { useCallback, useEffect } from "react";
import useCanvasStore from "@/lib/stores/canvas";
import { RrContent, RrNode } from "@/lib/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "../ui/spinner";
import { Tiptap } from "./tiptap";
import { Button } from "../ui/button";
import {
  useGetRrContentById,
  useUpdateRrContentById,
} from "@/hooks/use-rr-content";
import { CanvasState } from "@/lib/types/models";
import { useShallow } from "zustand/react/shallow";
import { PlusIcon } from "@radix-ui/react-icons";
import { useCreateRrContentForNode } from "@/hooks/use-rr-node";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const selector = (state: CanvasState) => ({
  selectedRrContentTab: state.selectedRrContentTab,
  setSelectedRrContentTab: state.setSelectedRrContentTab,
});

export function CanvasTabs({ currentRrNode }: { currentRrNode: RrNode }) {
  const params = useParams();
  const treeId = params.id as string;

  const { selectedRrContentTab, setSelectedRrContentTab } = useCanvasStore(
    useShallow(selector),
  );

  const {
    data: rrContent,
    isPending,
    isRefetching,
  } = useGetRrContentById(selectedRrContentTab ? selectedRrContentTab : "");

  const { mutate: saveRrNodeContent } = useUpdateRrContentById(
    selectedRrContentTab ? selectedRrContentTab : "",
  );

  const { mutate: createRrContentForNode } = useCreateRrContentForNode();
  const queryClient = useQueryClient();

  const handleCreateRrContentForNode = useCallback(
    (nodeId: string) => {
      createRrContentForNode(nodeId, {
        onSuccess: (data: { node: RrNode; content: RrContent }) => {
          queryClient.invalidateQueries({ queryKey: ["rrTree", treeId] });
          toast.success("Content 创建成功", {
            description: `成功为节点 ${data.node.title} 创建 content ${data.content.tabTitle}`,
          });
        },
      });
    },
    [createRrContentForNode, queryClient, treeId],
  );

  useEffect(() => {
    if (currentRrNode)
      setSelectedRrContentTab(currentRrNode.content[0]!.rrContent);
  }, [currentRrNode, setSelectedRrContentTab]);

  if (!selectedRrContentTab) {
    return (
      <div className="w-full, px-8 text-[var(--destructive)]">
        Current node has no contents
      </div>
    );
  }

  return (
    <Tabs
      defaultValue={currentRrNode.content[0]!.rrContent}
      value={selectedRrContentTab}
      onValueChange={(currentRrContentTab) =>
        setSelectedRrContentTab(currentRrContentTab)
      }
    >
      <div className="m-5 flex flex-row items-center">
        <TabsList>
          {currentRrNode.content.map((nodeContent) => (
            <TabsTrigger
              key={nodeContent.rrContent}
              value={nodeContent.rrContent}
            >
              {nodeContent.tabTitle}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => handleCreateRrContentForNode(currentRrNode._id)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      {currentRrNode.content.map((nodeContent) => (
        <TabsContent key={nodeContent.rrContent} value={nodeContent.rrContent}>
          {isPending || isRefetching ? (
            <div className="w-full p-5">
              <Spinner className="size-8 mx-auto" />
            </div>
          ) : (
            <Tiptap content={rrContent} onSave={saveRrNodeContent} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
