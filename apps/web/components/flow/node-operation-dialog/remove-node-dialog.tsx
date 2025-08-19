import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { RrNode } from "@/lib/types/models";

interface RemoveNodeData {
  nodeId: string;
  rootId: string;
}

interface RemoveNodeDialogProps {
  /** 要删除的节点信息 */
  node?: RrNode;
  /** 根节点ID */
  rootId: string;
  /** 外部控制对话框开关状态 */
  open: boolean;
  /** 外部控制对话框开关状态的回调 */
  onOpenChange: (open: boolean) => void;
  /** 删除节点的回调函数 */
  onConfirm: (data: RemoveNodeData) => void;
  /** 是否正在删除 */
  isDeleting?: boolean;
}

export function RemoveNodeDialog({
  node,
  rootId,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: RemoveNodeDialogProps) {
  const handleDelete = () => {
    if (!node) return;

    onConfirm({
      nodeId: node._id,
      rootId: rootId,
    });
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>永久删除</AlertDialogTitle>
          <AlertDialogDescription>
            这会删除<strong>&quot;{node?.title}&quot;</strong>
            节点，以及所有子节点且不可恢复。确认删除吗？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || !node}
          >
            {isDeleting ? "删除中..." : "删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
