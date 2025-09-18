"use client";

import { useState, useEffect } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import useFlowStore from "@/lib/stores/flow";
import { useShallow } from "zustand/react/shallow";
import { useGetRrNodeContent } from "@/hooks/use-rr-node-content";
import { FlowState } from "@/lib/types/models";

const selector = (state: FlowState) => ({
  currentNode: state.currentNode,
});

export const Tiptap = () => {
  const { currentNode } = useFlowStore(useShallow(selector));
  const contentId = currentNode?.content;

  const { data: nodeContent, isLoading } = useGetRrNodeContent(
    contentId && contentId !== null ? contentId : "invalid-id",
  );

  const [value, setValue] = useState<Content>("");

  // 当获取到内容时，更新编辑器的值
  useEffect(() => {
    if (nodeContent) {
      // 确保 content 是正确的类型
      setValue(nodeContent.content as Content);
    }
  }, [nodeContent]);

  if (isLoading) {
    return null;
  }

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
