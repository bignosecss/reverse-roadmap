import { NodeContent } from "@/lib/types/models";
import { TabsContent } from "../../ui/tabs";
import { Spinner } from "../../ui/spinner";
import { Tiptap } from "./tiptap";
import { useActiveRrContent } from "../hooks/useActiveRrContent";

interface RichTextEditorProps {
  nodeContent: NodeContent;
  selectedRrContentTab: string | null; // The currently selected/active tab ID
}

export function RichTextEditor({
  nodeContent,
  selectedRrContentTab
}: RichTextEditorProps) {
  // Load content for the currently selected tab to show in this panel
  const { rrContent, isPending, saveRrNodeContent } = useActiveRrContent(
    selectedRrContentTab
  );

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