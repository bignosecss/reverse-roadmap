"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import { Mermaid } from "./extensions/mermaid";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiMDResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
      <div className="flex justify-start mt-2">
        <Button
          variant="ghost"
          size="iconsm"
          onClick={handleCopy}
          className="h-8 text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
