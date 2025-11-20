import { useParams } from "next/navigation";
import React from "react";
import { NodeProps } from "@xyflow/react";

import { FlowNode } from "@/lib/types/models";
import RrNodeToolbar from "./rr-node-toolbar";
import RrNodeCard from "./rr-node-card";

/**
 * 自定义 RrNode 组件
 * 用于在 React Flow 中渲染思维导图节点
 */
export default function RrNodeComponent({
  data,
  selected,
}: NodeProps<FlowNode>) {
  const { rrNode } = data;

  // 判断是否为根节点
  const treeId = useParams().id as string;
  const isRootNode = rrNode._id === treeId;

  return (
    <>
      {/* 工具栏 */}
      <RrNodeToolbar
        isVisible={selected}
        isRootNode={isRootNode}
        currentNode={rrNode}
      />

      {/* 节点卡片 */}
      <RrNodeCard
        rrNode={rrNode}
        isSelected={selected}
        isRootNode={isRootNode}
      />
    </>
  );
}
