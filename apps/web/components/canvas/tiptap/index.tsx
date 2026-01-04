import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: "hello world",
  });

  return <EditorContent className="w-2/3" editor={editor} />;
}
