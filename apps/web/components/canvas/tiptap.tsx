"use client";

import { useCallback, useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import { RrNodeContent } from "@/lib/types/models";
import useCanvasStore from "@/lib/stores/canvas";
import { MutateOptions } from "@tanstack/react-query";

interface TiptapProps {
  content: RrNodeContent | undefined;
  onSave: (
    variables: Content,
    options?: MutateOptions<RrNodeContent, Error, Content, unknown> | undefined,
  ) => void;
}

export const Tiptap = ({ content, onSave: saveContent }: TiptapProps) => {
  const [value, setValue] = useState<Content>(content ? content : "");
  const setUpdatingContent = useCanvasStore(
    (state) => state.setUpdatingContent,
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
