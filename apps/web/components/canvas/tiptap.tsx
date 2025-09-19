"use client";

import { useEffect, useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import { RrNodeContent } from "@/lib/types/models";

interface TiptapProps {
  content: RrNodeContent;
}

const redundantAttributes = ["_id", "createdAt", "updatedAt", "__v"];

export const Tiptap = ({ content }: TiptapProps) => {
  const [value, setValue] = useState<Content>("");

  useEffect(() => {
    if (content) {
      // Create a copy of content to avoid mutating props directly
      const contentCopy = { ...content };
      for (const key in contentCopy) {
        if (redundantAttributes.includes(key)) {
          delete (contentCopy as any)[key];
        }
      }
      setValue(contentCopy);
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
