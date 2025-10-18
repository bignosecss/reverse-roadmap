import React from "react";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import SectionOne from "../section/one";
import { Separator } from "@/components/ui/separator";
import SectionTwo from "../section/two";
import SectionThree from "../section/three";
import SectionFour from "../section/four";
import SectionFive from "../section/five";

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="border-1 rounded-2xl bg-background shadow-md flex h-12 shrink-0 p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2" />

      <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />
    </div>
  </div>
);

export const ContentBubbleMenu = ({ editor }: { editor: Editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: "bottom-end",
      }}
    >
      <Toolbar editor={editor} />
    </BubbleMenu>
  );
};
