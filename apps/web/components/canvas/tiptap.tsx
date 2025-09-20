"use client";

import { useCallback, useEffect, useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import { RrNodeContent } from "@/lib/types/models";
import { useUpdateRrNodeContent } from "@/hooks/use-rr-node-content";

interface TiptapProps {
  content: RrNodeContent;
}

export const Tiptap = ({ content }: TiptapProps) => {
  const [value, setValue] = useState<Content>("");

  const { mutate: saveContent } = useUpdateRrNodeContent(content._id);

  const handleSetValue = useCallback(
    (value: Content) => {
      setValue(value);
      saveContent(value);
    },
    [saveContent],
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
