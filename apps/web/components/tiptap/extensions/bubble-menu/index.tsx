import { Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Button } from "@/components/ui/button";
import {
  FontBoldIcon,
  FontItalicIcon,
  LetterCaseCapitalizeIcon,
  QuoteIcon,
  StrikethroughIcon,
  HeadingIcon,
  ListBulletIcon,
  TextIcon,
} from "@radix-ui/react-icons";
import { ButtonSeparator } from "./button-separator";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CustomBubbleMenu({ editor }: { editor: Editor }) {
  const {
    isBold,
    isItalic,
    isStrikethrough,
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
          <Button
            variant="ghost"
            size="iconsm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={isStrikethrough ? "is-active" : ""}
            type="button"
          >
            <StrikethroughIcon />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="iconsm" type="button">
                <LetterCaseCapitalizeIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  className={`w-full justify-start ${
                    editor.isActive("paragraph") &&
                    !isHeading1 &&
                    !isHeading2 &&
                    !isHeading3 &&
                    !isHeading4 &&
                    !isHeading5 &&
                    !isHeading6
                      ? "is-active"
                      : ""
                  }`}
                  type="button"
                >
                  <TextIcon className="mr-2 h-4 w-4" />
                  Normal Text
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={`w-full justify-start ${
                    isHeading1 ? "is-active" : ""
                  }`}
                  type="button"
                >
                  <HeadingIcon className="mr-2 h-4 w-4" /> Heading 1
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`w-full justify-start ${
                    isHeading2 ? "is-active" : ""
                  }`}
                  type="button"
                >
                  <HeadingIcon className="mr-2 h-4 w-4" /> Heading 2
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={`w-full justify-start ${
                    isHeading3 ? "is-active" : ""
                  }`}
                  type="button"
                >
                  <HeadingIcon className="mr-2 h-4 w-4" /> Heading 3
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                  }
                  className={`w-full justify-start ${
                    isHeading4 ? "is-active" : ""
                  }`}
                  type="button"
                >
                  <HeadingIcon className="mr-2 h-4 w-4" /> Heading 4
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 5 }).run()
                  }
                  className={`w-full justify-start ${
                    isHeading5 ? "is-active" : ""
                  }`}
                  type="button"
                >
                  <HeadingIcon className="mr-2 h-4 w-4" /> Heading 5
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 6 }).run()
                  }
                  className={`w-full justify-start ${
                    isHeading6 ? "is-active" : ""
                  }`}
                  type="button"
                >
                  <HeadingIcon className="mr-2 h-4 w-4" /> Heading 6
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`w-full justify-start ${
                    isBulletList ? "is-active" : ""
                  }`}
                  type="button"
                >
                  <ListBulletIcon className="mr-2 h-4 w-4" /> Bullet list
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  className={`w-full justify-start ${
                    isOrderedList ? "is-active" : ""
                  }`}
                  type="button"
                >
                  <span className="mr-2 font-mono text-sm">1.</span>
                  Numbered list
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </BubbleMenu>
    </>
  );
}
