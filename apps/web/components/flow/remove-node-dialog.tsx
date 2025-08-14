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
import { RrNode } from "@/lib/types/models";
import { useDeleteNode } from "@/lib/service/rrNodeApi";
import { toast } from "sonner";

interface RemoveNodeDialogProps {
  node: RrNode;
  rootId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoveNodeDialog({
  node,
  rootId,
  open,
  onOpenChange,
}: RemoveNodeDialogProps) {
  const { mutate: deleteNode, isPending } = useDeleteNode();

  const handleDelete = () => {
    deleteNode(
      {
        nodeId: node._id,
        rootId: rootId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);

          toast.success("节点已删除", {
            description: `已成功删除节点「${node.title}」`,
          });
        },
        onError: (error) => {
          console.error("删除节点失败:", error);

          toast.error("删除节点失败", {
            description: `删除节点「${node.title}」失败`,
          });
        },
      },
    );
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>永久删除</AlertDialogTitle>
          <AlertDialogDescription>
            这会删除<strong>&quot;{node.title}&quot;</strong>
            节点，以及所有子节点且不可恢复。确认删除吗？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "删除中..." : "删除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
