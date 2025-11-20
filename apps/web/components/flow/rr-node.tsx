import { useParams } from "next/navigation";
import React from "react";
import { NodeProps } from "@xyflow/react";

import { FlowNode, RrRootStatus } from "@/lib/types/models";
import RrNodeToolbar from "./toolbar/rr-node-toolbar";
import RrNodeCard from "./rr-node-card";
import useSidebarStore from "@/lib/stores/sidebar";

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
  const mode = useSidebarStore((state) => state.mode);

  return (
    <>
      {/* 工具栏 */}
      {mode === RrRootStatus.private && (
        <RrNodeToolbar
          isVisible={selected}
          isRootNode={isRootNode}
          currentNode={rrNode}
        />
      )}

      {/* 节点卡片 */}
      <RrNodeCard
        rrNode={rrNode}
        isSelected={selected}
        isRootNode={isRootNode}
      />
    </>
  );
}
