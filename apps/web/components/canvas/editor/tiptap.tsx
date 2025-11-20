"use client";

import { useCallback, useState } from "react";
import { Content } from "@tiptap/react";
import { RrContent } from "@/lib/types/models";
import useCanvasStore from "@/lib/stores/canvas";
import { UseMutateFunction } from "@tanstack/react-query";
import { CreateRrContentDto } from "@/lib/types/apiRequests";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";

interface TiptapProps {
  content: RrContent | undefined;
  onSave: UseMutateFunction<RrContent, Error, CreateRrContentDto, unknown>;
}

export const Tiptap = ({ content, onSave: saveContent }: TiptapProps) => {
  const [value, setValue] = useState<Content>(content ? content : "");
  const setSavingContent = useCanvasStore((state) => state.setSavingContent);

  const handleSetValue = useCallback(
    (value: Content) => {
      setSavingContent(true);
      setValue(value);
      saveContent(value as RrContent, {
        onSettled: () => setSavingContent(false),
      });
    },
    [saveContent, setSavingContent],
  );

  return (
    <MinimalTiptapEditor
      value={value}
      onChange={handleSetValue}
      className="w-full"
      editorContentClassName="p-5"
      output="json"
      placeholder="Enter your description..."
      autofocus={false}
      editable={true}
      editorClassName="focus:outline-hidden"
      throttleDelay={3000}
    />
  );
};
