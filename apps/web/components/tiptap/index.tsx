import { useRef } from "react";
import { useAutoSave } from "./hooks";
import { RrContent } from "@repo/shared";
import { EditorContent, useEditor } from "@tiptap/react";
import { EditorView } from "@tiptap/pm/view";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "./extensions/image";
import CustomBubbleMenu from "./extensions/bubble-menu";
import { SlashCommands } from "./extensions/slash-commands";
import ImageDialog from "./extensions/image/components/image-dialog";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

import "./styles/tiptap.css";

interface TiptapProps {
  tabId: string;
  content: RrContent;
}

export default function Tiptap({ tabId, content: rrContent }: TiptapProps) {
  const { handleContentChange } = useAutoSave(tabId);
  const isComposition = useRef(false);
  const lowlight = createLowlight(common);

  const editor = useEditor({
    extensions: [
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
      Image.configure({
        resize: {
          enabled: true,
          minWidth: 60,
          minHeight: 60,
          alwaysPreserveAspectRatio: true,
        },
      }),
      SlashCommands,
    ],
    immediatelyRender: false,
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-p:my-2 prose-h1:my-2 prose-h2:my-2 prose-h3:my-2 prose-ul:my-2 prose-ol:my-2 max-w-none focus:outline-none w-full",
      },
      handleDOMEvents: {
        compositionstart: () => {
          isComposition.current = true;
          return false;
        },
        compositionend: (view: EditorView) => {
          isComposition.current = false;
          handleContentChange(view.state.doc.toJSON());
          return false;
        },
      },
    },
    onUpdate: ({ editor, transaction }) => {
      if (isComposition.current) {
        return;
      }

      if (transaction.docChanged) {
        handleContentChange(editor.getJSON());
      }
    },
    onCreate: ({ editor }) =>
      editor.commands.setContent(rrContent, { emitUpdate: false }),
  });

  return (
    <>
      {!!editor && (
        <>
          <CustomBubbleMenu editor={editor} />
          <ImageDialog editor={editor} />
        </>
      )}
      <EditorContent className="w-2/3" editor={editor} />
    </>
  );
}
