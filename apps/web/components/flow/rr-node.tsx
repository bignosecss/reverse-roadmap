import React, { useState } from "react";
import { Handle, Position, type NodeProps, NodeToolbar } from "@xyflow/react";
import { RrNode } from "@/lib/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { AddNodeDialog } from "./add-node-dialog";

/**
 * 自定义 RrNode 组件
 * 用于在 React Flow 中渲染思维导图节点
 */
const RrNodeComponent: React.FC<NodeProps> = ({ data, selected }) => {
  const { rrNode } = data as {
    label: string;
    rrNode: RrNode;
  };

  const pathname = usePathname();
  const [showAddDialog, setShowAddDialog] = useState(false);

  // 判断是否为根节点（没有 parentId）
  const isRootNode = !rrNode.parentId;

  // 获取根节点ID
  const rootTreeId = pathname.split("/g/")[1] || "";



  const handleEditNode = () => {
    console.log("编辑节点:", rrNode._id);
    // TODO: 实现编辑节点逻辑
  };

  const handleDeleteNode = () => {
    console.log("删除节点:", rrNode._id);
    // TODO: 实现删除节点逻辑
  };

  return (
    <>
      {/* NodeToolbar - 节点工具栏 */}
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex gap-1 p-1 bg-background border rounded-md shadow-lg"
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAddDialog(true)}
          className="h-7 w-7 p-0"
          title="添加"
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEditNode}
          className="h-7 w-7 p-0"
          title="编辑"
        >
          <Edit className="h-3 w-3" />
        </Button>
        {!isRootNode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDeleteNode}
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            title="删除"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </NodeToolbar>

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

      {/* 添加节点对话框 */}
      <AddNodeDialog
        parentNode={rrNode}
        rootId={rootTreeId}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </>
  );
};

export default RrNodeComponent;
