"use client";

import { useCallback, useEffect, useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import { RrNodeContent } from "@/lib/types/models";
import { useUpdateRrNodeContent } from "@/hooks/use-rr-node-content";
import useCanvasStore from "@/lib/stores/canvas";

interface TiptapProps {
  content: RrNodeContent | undefined;
}

export const Tiptap = ({ content }: TiptapProps) => {
  const [value, setValue] = useState<Content>("");
  const setUpdatingContent = useCanvasStore(
    (state) => state.setUpdatingContent,
  );

  const { mutate: saveContent } = useUpdateRrNodeContent(
    content ? content._id : "",
  );

  const handleSetValue = useCallback(
    (value: Content) => {
      setUpdatingContent(true);
      setValue(value);
      saveContent(value, {
        onSettled: () => setUpdatingContent(false),
      });
    },
    [saveContent, setUpdatingContent],
  );

  useEffect(() => {
    if (content) {
      // 删掉多余的属性
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, __v, ...restContent } = content;
      setValue(restContent);
    }
  }, [content]);

  return (
    <MinimalTiptapEditor
      value={value}
      onChange={handleSetValue}
      className="w-full"
      editorContentClassName="p-5"
      output="json"
      placeholder="Enter your description..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-hidden"
      throttleDelay={3000}
    />
  );
};
