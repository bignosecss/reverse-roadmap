"use client";

import { useEffect, useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import { RrNodeContent } from "@/lib/types/models";

interface TiptapProps {
  content: RrNodeContent;
}

export const Tiptap = ({ content }: TiptapProps) => {
  const [value, setValue] = useState<Content>("");

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
      onChange={setValue}
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Enter your description..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-hidden"
      throttleDelay={3000}
    />
  );
};
