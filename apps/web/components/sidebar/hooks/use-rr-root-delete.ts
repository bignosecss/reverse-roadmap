import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { RrRoot } from "@/lib/types/models";
import { useDeleteRrRoot } from "@/hooks/use-rr-root";
import { RootsQueryKey } from "@/lib/types/models";

export function useRrRootDelete(rrRoot: RrRoot) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  const { mutate: deleteRrRoot, isPending: isRootDeleting } = useDeleteRrRoot(
    rrRoot._id,
  );

  const handleDeleteRoot = useCallback(() => {
    const previousData: RrRoot[] | undefined = queryClient.getQueryData([
      RootsQueryKey.private,
    ]);
    queryClient.cancelQueries({ queryKey: [RootsQueryKey.private] });
    queryClient.setQueryData(
      [RootsQueryKey.private],
      (old: RrRoot[] | undefined) => {
        if (!old) return old;
        return old.filter((root) => root._id !== rrRoot._id);
      },
    );

    // Also handle public roots if needed
    const previousPublicData = queryClient.getQueryData([RootsQueryKey.public]);
    queryClient.cancelQueries({ queryKey: [RootsQueryKey.public] });
    queryClient.setQueryData(
      [RootsQueryKey.public],
      (old: RrRoot[] | undefined) => {
        if (!old) return old;
        return old.filter((root) => root._id !== rrRoot._id);
      },
    );

    setIsDialogOpen(false);
    if (currentTreeId === rrRoot.rootRrNode) {
      router.push(`/g/${previousData![1]!.rootRrNode}`);
    }

    deleteRrRoot(undefined, {
      onSuccess: (deletedRoot: RrRoot) => {
        // Invalidate other queries to ensure data stays fresh
        queryClient.invalidateQueries({ queryKey: ["rrRoot", rrRoot._id] });

        toast.success("删除成功", {
          position: "top-center",
          description: `成功删除 ${deletedRoot.title}`,
        });
      },
      onError: (err: unknown) => {
        // If the mutation fails, rollback the optimistic update
        queryClient.setQueryData([RootsQueryKey.private], previousData);
        queryClient.setQueryData([RootsQueryKey.public], previousPublicData);

        toast.error("删除失败", {
          position: "top-center",
          description: JSON.stringify(err),
        });
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [RootsQueryKey.public] });
        queryClient.invalidateQueries({ queryKey: [RootsQueryKey.private] });
      },
    });
  }, [currentTreeId, deleteRrRoot, queryClient, router, rrRoot]);

  return {
    isDialogOpen,
    setIsDialogOpen,
    isRootDeleting,
    handleDeleteRoot,
  };
}
