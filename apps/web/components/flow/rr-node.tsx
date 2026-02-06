import React from "react";
import { NodeProps } from "@xyflow/react";
import { useTreeId } from "@/hooks/use-tree-id";

import { FlowNode } from "@repo/shared/flow";
import RrNodeToolbar from "./toolbar";
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
  const treeId = useTreeId();
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
