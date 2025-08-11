import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { RrNode } from "@/lib/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card
      className={`
        rr-node
        min-w-[250px] max-w-[300px]
        transition-all duration-200
        ${selected ? "ring-2 ring-primary shadow-lg" : ""}
        hover:shadow-lg
      `}
    >
      {/* 输入连接点 */}
      {!isRootNode && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary border-2 border-background"
        />
      )}

      <CardHeader className="pb-2">
        <CardTitle
          className={`
            text-sm leading-tight
            ${isRootNode ? "text-primary" : "text-foreground"}
          `}
        >
          {rrNode.title}
        </CardTitle>
        {rrNode.description && (
          <CardDescription className="text-xs leading-relaxed">
            {rrNode.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span
            className={`
            text-xs px-2 py-1 rounded-full
            ${isRootNode ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}
          `}
          >
            {isRootNode ? "根节点" : "子节点"}
          </span>

          {rrNode.children && rrNode.children.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {rrNode.children.length} 子节点
            </span>
          )}
        </div>
      </CardContent>

      {/* 输出连接点 */}
      {rrNode.children && rrNode.children.length > 0 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-accent border-2 border-background"
        />
      )}
    </Card>
  );
};

export default RrNodeComponent;
