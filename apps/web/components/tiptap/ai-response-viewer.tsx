import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import { Mermaid } from "./extensions/mermaid";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import "./styles/tiptap.css";

export const AIResponseViewer = ({
  aiMDResponse,
}: {
  aiMDResponse: string;
}) => {
  const lowlight = createLowlight(common);

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Markdown,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
        enableTabIndentation: true,
        tabSize: 2,
      }),
      Typography,
      TextAlign.configure({ types: ["heading", "paragraph", "codeblock"] }),
      TableKit.configure({ table: { resizable: true } }),
      Mermaid,
      HorizontalRule,
    ],
    content: aiMDResponse,
    immediatelyRender: true,
  });

  return <EditorContent editor={editor} />;
};
