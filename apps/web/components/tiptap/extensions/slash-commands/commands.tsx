import React from "react";
import type { Editor, Range } from "@tiptap/react";
import { ImageIcon, QuoteIcon, TableIcon } from "@radix-ui/react-icons";
import { Workflow, Minus } from "lucide-react";
import useImageDialogStore from "@/lib/stores/tiptap";
import { useChatStore } from "@/lib/stores/chat";

export interface Command {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

export const commands: Command[] = [
  {
    title: "聊聊～",
    subtitle: "",
    icon: <QuoteIcon className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      useChatStore.getState().toggleChat(true, undefined, "");
    },
  },
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
  {
    title: "Mermaid 图表",
    subtitle: "Create flowcharts, sequence diagrams, and more",
    icon: <Workflow className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertMermaid(
          "graph TD\n    A[Start] --> B[Process]\n    B --> C[End]",
        )
        .run();
    },
  },
  {
    title: "分割线",
    subtitle: "Insert a horizontal divider",
    icon: <Minus className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];
