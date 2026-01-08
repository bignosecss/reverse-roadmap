import { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { ImageIcon, VideoIcon } from "@radix-ui/react-icons";
import TablePopover from "../bubble-menu/table-popover";
import { ButtonSeparator } from "../bubble-menu/button-separator";
import { toast } from "sonner";

export default function TempButtonGroup({ editor }: { editor: Editor }) {
  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className=".bubble-menu">
      <TablePopover editor={editor} />
      <ButtonSeparator />
      <Button variant="ghost" size="iconsm" onClick={addImage} type="button">
        <ImageIcon />
      </Button>
      <Button
        variant="ghost"
        size="iconsm"
        onClick={() => toast.info("正在开发中...", { position: "top-center" })}
        type="button"
      >
        <VideoIcon />
      </Button>
    </div>
  );
}
