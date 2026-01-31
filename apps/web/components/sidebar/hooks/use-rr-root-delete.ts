import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteRrRoot } from "@/hooks/use-rr-root";
import { RrRoot } from "@repo/shared";
import { useTreeId } from "@/hooks/use-tree-id";

export function useRrRootDelete(rrRoot: RrRoot) {
  const currentTreeId = useTreeId();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: deleteRrRootAsync, isPending: isRootDeleting } =
    useDeleteRrRoot(rrRoot._id);

  const handleDeleteRoot = useCallback(async () => {
    // Store previous data
    const previousData: RrRoot[] | undefined = queryClient.getQueryData([
      "rrRoots",
    ]);

    // Cancel queries and update optimistically
    queryClient.cancelQueries({ queryKey: ["rrRoots"] });
    queryClient.setQueryData(["rrRoots"], (old: RrRoot[] | undefined) => {
      if (!old) return old;
      return old.filter((root) => root._id !== rrRoot._id);
    });

    const currentData: RrRoot[] | undefined = queryClient.getQueryData([
      "rrRoots",
    ]);
    setIsDialogOpen(false);
    if (currentTreeId === rrRoot.rootRrNode) {
      router.push(`/g/${currentData![0]!.rootRrNode}`);
    }

    try {
      const deletedRoot = await deleteRrRootAsync(undefined);

      toast.success("删除成功", {
        position: "top-center",
        description: `成功删除 ${deletedRoot.title}`,
      });
    } catch (err: unknown) {
      // If the mutation fails, rollback the optimistic update
      queryClient.setQueryData(["rrRoots"], previousData);

      toast.error("删除失败", {
        position: "top-center",
        description: JSON.stringify(err),
      });
    } finally {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
    }
  }, [currentTreeId, deleteRrRootAsync, queryClient, router, rrRoot]);

  return {
    isDialogOpen,
    setIsDialogOpen,
    isRootDeleting,
    handleDeleteRoot,
  };
}
