"use client";

import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { RrNode } from "@/lib/types/models";

/**
 * 自定义 RrNode 组件
 * 用于在 React Flow 中渲染思维导图节点
 */
const RrNodeComponent: React.FC<NodeProps> = ({ data, selected }) => {
  const { rrNode } = data as {
    label: string;
    rrNode: RrNode;
  };

  // 判断是否为根节点（没有 parentId）
  const isRootNode = !rrNode.parentId;

  return (
    <div
      className={`
        rr-node
        min-w-[150px] max-w-[250px]
        bg-white border-2 rounded-lg shadow-md
        transition-all duration-200
        ${selected ? "border-blue-500 shadow-lg" : "border-gray-300"}
        ${isRootNode ? "bg-blue-50 border-blue-400" : ""}
        hover:shadow-lg hover:border-gray-400
      `}
    >
      {/* 输入连接点 */}
      {!isRootNode && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      )}

      {/* 节点内容 */}
      <div className="p-3">
        <div className="node-header">
          <h3
            className={`
            font-semibold text-sm leading-tight
            ${isRootNode ? "text-blue-800" : "text-gray-800"}
          `}
          >
            {rrNode.title}
          </h3>
        </div>

        {rrNode.description && (
          <div className="node-description mt-2">
            <p className="text-xs text-gray-600 leading-relaxed">
              {rrNode.description}
            </p>
          </div>
        )}

        {/* 节点信息 */}
        <div className="mt-2 flex items-center justify-between">
          <span
            className={`
            text-xs px-2 py-1 rounded-full
            ${isRootNode ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}
          `}
          >
            {isRootNode ? "根节点" : "子节点"}
          </span>

          {rrNode.children && rrNode.children.length > 0 && (
            <span className="text-xs text-gray-500">
              {rrNode.children.length} 子节点
            </span>
          )}
        </div>
      </div>

      {/* 输出连接点 */}
      {rrNode.children && rrNode.children.length > 0 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
      )}
    </div>
  );
};

export default RrNodeComponent;
