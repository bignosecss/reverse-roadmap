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
      Markdown,
      StarterKit.configure({
        codeBlock: false,
      }),
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
    contentType: "markdown",
    immediatelyRender: true,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-p:my-2 prose-h1:my-2 prose-h2:my-2 prose-h3:my-2 prose-ul:my-2 prose-ol:my-2 max-w-none focus:outline-none w-full",
      },
    },
  });

  return <EditorContent editor={editor} />;
};
