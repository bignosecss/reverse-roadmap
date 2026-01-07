import { useCallback, useEffect, useRef } from "react";
import { useGetRrContentById } from "@/hooks/use-rr-content";
import { Content, Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAutoSave } from "./hooks";

interface TiptapProps {
  tabId: string;
}

export default function Tiptap({ tabId }: TiptapProps) {
  const { data: rrContent, isLoading: isRrContentLoading } =
    useGetRrContentById(tabId);
  const editorRef = useRef<ReturnType<typeof useEditor> | null>(null);
  const { handleContentChange } = useAutoSave(tabId);

  const handleUpdate = useCallback(
    (editor: Editor) => handleContentChange(editor.getJSON()),
    [handleContentChange],
  );

  // tiptap editor 仅初始化一次
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-p:my-2 prose-h1:my-2 prose-h2:my-2 prose-h3:my-2 prose-ul:my-2 prose-ol:my-2 max-w-none focus:outline-none w-full",
      },
    },
    // TODO: 解决只有一个 editor，所以切换 tab 会出发 onUpdate 的问题
    onUpdate: ({ editor }) => handleUpdate(editor),
  });

  useEffect(() => {
    editorRef.current = editor;
    return () => editor?.destroy();
  }, [editor]);

  useEffect(() => {
    if (isRrContentLoading || !rrContent || !editorRef.current) return;

    editorRef.current
      .chain()
      .clearContent()
      .setContent(rrContent as Content)
      .focus()
      .run();
  }, [isRrContentLoading, rrContent]);

  if (isRrContentLoading) {
    return <div className="w-2/3">加载中...</div>;
  }

  return <EditorContent className="w-2/3" editor={editor} />;
}
