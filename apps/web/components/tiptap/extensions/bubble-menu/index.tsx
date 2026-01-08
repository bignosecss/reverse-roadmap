import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Button } from "@/components/ui/button";
import { FontBoldIcon, FontItalicIcon, QuoteIcon } from "@radix-ui/react-icons";
import { ButtonSeparator } from "./button-separator";
import TextStylePopover from "./text-style-popover";
import { toast } from "sonner";

export default function CustomBubbleMenu({ editor }: { editor: Editor }) {
  const {
    isBold,
    isItalic,
    isStrikethrough,
    isUnderline,
    isHeading1,
    isHeading2,
    isHeading3,
    isHeading4,
    isHeading5,
    isHeading6,
    isBulletList,
    isOrderedList,
  } = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrikethrough: ctx.editor.isActive("strike"),
      isUnderline: ctx.editor.isActive("underline"),
      isHeading1: ctx.editor.isActive("heading", { level: 1 }),
      isHeading2: ctx.editor.isActive("heading", { level: 2 }),
      isHeading3: ctx.editor.isActive("heading", { level: 3 }),
      isHeading4: ctx.editor.isActive("heading", { level: 4 }),
      isHeading5: ctx.editor.isActive("heading", { level: 5 }),
      isHeading6: ctx.editor.isActive("heading", { level: 6 }),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
    }),
  });

  return (
    <>
      <BubbleMenu
        editor={editor}
        options={{ placement: "bottom", offset: 8, flip: true }}
      >
        <div className="bubble-menu">
          <Button
            variant="ghost"
            size="iconsm"
            onClick={() =>
              toast.info("Talk to AI", {
                description: "正在开发...",
                position: "top-center",
              })
            }
            className="w-fit px-1.5"
            type="button"
          >
            <QuoteIcon />
            聊聊～
          </Button>
          <ButtonSeparator />
          <Button
            variant="ghost"
            size="iconsm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={isBold ? "is-active" : ""}
            type="button"
          >
            <FontBoldIcon />
          </Button>
          <Button
            variant="ghost"
            size="iconsm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={isItalic ? "is-active" : ""}
            type="button"
          >
            <FontItalicIcon />
          </Button>
          <TextStylePopover
            editor={editor}
            isHeading1={isHeading1}
            isHeading2={isHeading2}
            isHeading3={isHeading3}
            isHeading4={isHeading4}
            isHeading5={isHeading5}
            isHeading6={isHeading6}
            isBulletList={isBulletList}
            isOrderedList={isOrderedList}
            isStrikethrough={isStrikethrough}
            isUnderline={isUnderline}
          />
        </div>
      </BubbleMenu>
    </>
  );
}
