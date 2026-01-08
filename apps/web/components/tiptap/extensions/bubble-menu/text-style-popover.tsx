import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  LetterCaseCapitalizeIcon,
  HeadingIcon,
  ListBulletIcon,
  TextIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextStylePopoverProps {
  editor: Editor;
  isHeading1: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
  isHeading4: boolean;
  isHeading5: boolean;
  isHeading6: boolean;
  isBulletList: boolean;
  isOrderedList: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
}

export default function TextStylePopover({
  editor,
  isHeading1,
  isHeading2,
  isHeading3,
  isHeading4,
  isHeading5,
  isHeading6,
  isBulletList,
  isOrderedList,
  isStrikethrough,
  isUnderline,
}: TextStylePopoverProps) {
  return (
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
            className={`w-full justify-start ${isHeading1 ? "is-active" : ""}`}
            type="button"
          >
            <HeadingIcon className="mr-2 h-4 w-4" /> Heading 1
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`w-full justify-start ${isHeading2 ? "is-active" : ""}`}
            type="button"
          >
            <HeadingIcon className="mr-2 h-4 w-4" /> Heading 2
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`w-full justify-start ${isHeading3 ? "is-active" : ""}`}
            type="button"
          >
            <HeadingIcon className="mr-2 h-4 w-4" /> Heading 3
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={`w-full justify-start ${isHeading4 ? "is-active" : ""}`}
            type="button"
          >
            <HeadingIcon className="mr-2 h-4 w-4" /> Heading 4
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={`w-full justify-start ${isHeading5 ? "is-active" : ""}`}
            type="button"
          >
            <HeadingIcon className="mr-2 h-4 w-4" /> Heading 5
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={`w-full justify-start ${isHeading6 ? "is-active" : ""}`}
            type="button"
          >
            <HeadingIcon className="mr-2 h-4 w-4" /> Heading 6
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`w-full justify-start ${
              isBulletList ? "is-active" : ""
            }`}
            type="button"
          >
            <ListBulletIcon className="mr-2 h-4 w-4" /> Bullet list
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`w-full justify-start ${
              isOrderedList ? "is-active" : ""
            }`}
            type="button"
          >
            <span className="mr-1 font-mono text-sm">1.</span>
            Numbered list
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`w-full justify-start ${isUnderline ? "is-active" : ""}`}
            type="button"
          >
            <UnderlineIcon className="mr-2 h-4 w-4" /> Underline
          </Button>
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`w-full justify-start ${
              isStrikethrough ? "is-active" : ""
            }`}
            type="button"
          >
            <StrikethroughIcon className="mr-2 h-4 w-4" /> Strike
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
