import React from "react";
import type { Editor, Range } from "@tiptap/react";
import { ImageIcon, TableIcon } from "@radix-ui/react-icons";
import useImageDialogStore from "@/lib/stores/tiptap";

export interface Command {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

export const commands: Command[] = [
  {
    title: "图片",
    subtitle: "Insert an image from URL or upload",
    icon: <ImageIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      useImageDialogStore.getState().open();
    },
  },
  {
    title: "表格",
    subtitle: "",
    icon: <TableIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
];
