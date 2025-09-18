"use client";

import { useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";

export const Tiptap = () => {
  const [value, setValue] = useState<Content>("");

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
    />
  );
};
