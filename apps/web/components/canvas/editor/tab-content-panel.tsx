import { RrContent, NodeContent } from "@/lib/types/models";
import { TabsContent } from "../../ui/tabs";
import { Spinner } from "../../ui/spinner";
import { Tiptap } from "./tiptap";

interface TabContentPanelProps {
  nodeContent: NodeContent;
  isPending: boolean;
  rrContent: RrContent | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveRrNodeContent: (content: any) => void;
}

export function TabContentPanel({
  nodeContent,
  isPending,
  rrContent,
  saveRrNodeContent,
}: TabContentPanelProps) {
  return (
    <TabsContent key={nodeContent.rrContent} value={nodeContent.rrContent}>
      {isPending ? (
        <div className="w-full p-5">
          <Spinner className="size-8 mx-auto" />
        </div>
      ) : (
        <Tiptap content={rrContent} onSave={saveRrNodeContent} />
      )}
    </TabsContent>
  );
}
