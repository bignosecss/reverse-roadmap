import { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "@radix-ui/react-icons";
import TablePopover from "../bubble-menu/table-popover";
import { ButtonSeparator } from "../bubble-menu/button-separator";
import AddImageButton from "../image/components/add-image-button";

export default function TempButtonGroup({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-row items-center gap-1 p-1 rounded-lg border border-input shadow-sm">
      <TablePopover editor={editor} />
      <ButtonSeparator />
      <AddImageButton editor={editor} />
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
