import { useEffect, useRef } from "react";
import { useGetRrContentById } from "@/hooks/use-rr-content";
import { Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapProps {
  tabId: string;
}

export default function Tiptap({ tabId }: TiptapProps) {
  const { data: rrContent, isLoading: isRrContentLoading } =
    useGetRrContentById(tabId);
  const editorRef = useRef<ReturnType<typeof useEditor> | null>(null);

  // tiptap editor 仅初始化一次
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: "",
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

    console.log("编辑器内容已更新：", rrContent);
  }, [isRrContentLoading, rrContent]);

  if (isRrContentLoading) {
    return <div className="w-2/3">加载中...</div>;
  }

  return <EditorContent className="w-2/3" editor={editor} />;
}
