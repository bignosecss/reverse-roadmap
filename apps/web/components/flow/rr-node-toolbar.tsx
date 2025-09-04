import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "../ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";

interface RrNodeToolbarProps {
  isVisible: boolean;
  isRootNode: boolean;
  onAdd: () => void;
  onUpdate: () => void;
  onRemove: () => void;
}

export default function RrNodeToolbar({
  isVisible,
  isRootNode,
  onAdd: handleAdd,
  onUpdate: handleUpdate,
  onRemove: handleRemove,
}: RrNodeToolbarProps) {
  return (
    <>
      {/* NodeToolbar - 节点工具栏 */}
      <NodeToolbar
        isVisible={isVisible}
        position={Position.Top}
        className="flex gap-1 p-1 bg-background border rounded-md shadow-lg"
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={handleAdd}
          className="h-7 w-7 p-0"
          title="添加"
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleUpdate}
          className="h-7 w-7 p-0"
          title="编辑"
        >
          <Edit className="h-3 w-3" />
        </Button>
        {!isRootNode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            title="删除"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </NodeToolbar>
    </>
  );
}
