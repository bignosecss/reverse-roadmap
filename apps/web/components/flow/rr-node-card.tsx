import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CanvasState, RrNode } from "@/lib/types/models";
import useFlowStore from "@/lib/stores/flow";
import useCanvasStore from "@/lib/stores/canvas";
import { useSidebar } from "../ui/sidebar";
import { Spinner } from "../ui/spinner";

interface RrNodeCardProps {
  rrNode: RrNode;
  isSelected: boolean;
  isRootNode: boolean;
}

const canvasSelector = (state: CanvasState) => ({
  canvasOpen: state.canvasOpen,
  setCanvasOpen: state.setCanvasOpen,
});

export default function RrNodeCard({
  rrNode,
  isSelected: selected,
  isRootNode,
}: RrNodeCardProps) {
  const setCurrentRrNode = useFlowStore((state) => state.setCurrentRrNode);

  const { canvasOpen, setCanvasOpen } = useCanvasStore(
    useShallow(canvasSelector),
  );
  const { setOpen } = useSidebar();

  const handleNodeClick = useCallback(
    (node: RrNode) => {
      setCurrentRrNode(node);
      if (!canvasOpen) {
        setCanvasOpen(true);
        setOpen(false);
      }
    },
    [canvasOpen, setCanvasOpen, setCurrentRrNode, setOpen],
  );

  return (
    <Card
      onClick={() => handleNodeClick(rrNode)}
      className={`
          rr-node
          min-w-[250px] max-w-[300px]
          transition-all duration-200
          ${selected ? "ring-2 ring-primary shadow-lg" : ""}
          ${rrNode.pending ? "opacity-50" : ""}
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

      {rrNode.pending && (
        <div className="absolute top-2 right-2">
          <Spinner />
        </div>
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
}
