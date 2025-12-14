import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import useFlowStore from "@/lib/stores/flow";
import { cn } from "@/lib/utils";
import { NodeStatusBadge } from "../badges";
import { RrNode, RrNodeStatus } from "@repo/shared/models";

interface RrNodeCardProps {
  rrNode: RrNode;
  isSelected: boolean;
  isRootNode: boolean;
}

export default function RrNodeCard({
  rrNode,
  isSelected: selected,
  isRootNode,
}: RrNodeCardProps) {
  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);
  const deletingFlowData = useFlowStore((state) => state.deletingFlowData);

  // Check if current node is in the deleting nodes array
  const isDeleting = deletingFlowData?.nodes?.some(
    (node) => node.data.rrNode._id === rrNode._id,
  );

  const handleNodeClick = useCallback(
    (node: RrNode) => {
      setCurrentRrNode(node);
    },
    [setCurrentRrNode],
  );

  return (
    <Card
      onClick={isDeleting ? undefined : () => handleNodeClick(rrNode)}
      className={cn(
        "rr-node",
        "min-w-[250px] max-w-[300px]",
        "transition-all duration-200",
        "hover:shadow-lg",
        selected ? "ring-2 ring-primary shadow-lg" : "",
        isDeleting ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
      )}
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
          <CardDescription className="text-xs leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap">
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
            {isRootNode ? "终极目标" : "规划"}
          </span>

          {/* Status badge if status exists */}
          {rrNode.status ? (
            <NodeStatusBadge status={rrNode.status} />
          ) : (
            <NodeStatusBadge status={RrNodeStatus.Active} />
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
}
