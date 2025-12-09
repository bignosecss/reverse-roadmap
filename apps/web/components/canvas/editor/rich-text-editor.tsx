import { TabsContent } from "../../ui/tabs";
import { Spinner } from "../../ui/spinner";
import { Tiptap } from "./tiptap";
import { useActiveRrContent } from "../hooks/useActiveRrContent";
import { NodeContent } from "@repo/shared/models";

interface RichTextEditorProps {
  nodeContent: NodeContent;
  selectedRrContentTab: string | null;
}

export function RichTextEditor({
  nodeContent,
  selectedRrContentTab,
}: RichTextEditorProps) {
  const { rrContent, isPending, saveRrNodeContent } =
    useActiveRrContent(selectedRrContentTab);

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
