import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useDeleteRrRoot } from "@/hooks/use-rr-root";
import { RootsQueryKey, RrRoot } from "@repo/shared/models";

export function useRrRootDelete(rrRoot: RrRoot) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const { mutateAsync: deleteRrRootAsync, isPending: isRootDeleting } =
    useDeleteRrRoot(rrRoot._id);

  const handleDeleteRoot = useCallback(async () => {
    // Store previous data for both private and public roots
    const previousPrivateData: RrRoot[] | undefined = queryClient.getQueryData([
      RootsQueryKey.private,
    ]);
    const previousPublicData: RrRoot[] | undefined = queryClient.getQueryData([
      RootsQueryKey.public,
    ]);

    const rootsQueryKeys = [RootsQueryKey.private, RootsQueryKey.public];

    // Cancel queries and update both private and public roots optimistically
    rootsQueryKeys.forEach((key) => {
      queryClient.cancelQueries({ queryKey: [key] });
      queryClient.setQueryData([key], (old: RrRoot[] | undefined) => {
        if (!old) return old;
        return old.filter((root) => root._id !== rrRoot._id);
      });
    });

    const currentData: RrRoot[] | undefined = queryClient.getQueryData([
      RootsQueryKey.private,
    ]);
    setIsDialogOpen(false);
    if (currentTreeId === rrRoot.rootRrNode) {
      router.push(`/g/${currentData![0]!.rootRrNode}`);
    }

    try {
      const deletedRoot = await deleteRrRootAsync(undefined);

      // Invalidate other queries to ensure data stays fresh
      queryClient.invalidateQueries({ queryKey: ["rrRoot", rrRoot._id] });

      toast.success("删除成功", {
        position: "top-center",
        description: `成功删除 ${deletedRoot.title}`,
      });
    } catch (err: unknown) {
      // If the mutation fails, rollback the optimistic update for both private and public roots
      queryClient.setQueryData([RootsQueryKey.private], previousPrivateData);
      queryClient.setQueryData([RootsQueryKey.public], previousPublicData);

      toast.error("删除失败", {
        position: "top-center",
        description: JSON.stringify(err),
      });
    } finally {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: [RootsQueryKey.public] });
      queryClient.invalidateQueries({ queryKey: [RootsQueryKey.private] });
    }
  }, [currentTreeId, deleteRrRootAsync, queryClient, router, rrRoot]);

  return {
    isDialogOpen,
    setIsDialogOpen,
    isRootDeleting,
    handleDeleteRoot,
  };
}
