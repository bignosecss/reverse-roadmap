import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RrRoot } from "@/lib/types/models";
import { useDeleteRrRoot } from "@/hooks/use-rr-root";

export function useRrRootDelete(rrRoot: RrRoot) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteRrRoot, isPending: isRootDeleting } = useDeleteRrRoot(
    rrRoot._id,
  );

  const handleDeleteRoot = useCallback(() => {
    deleteRrRoot(undefined, {
      onSettled: () => {
        setIsDialogOpen(false);
      },
      onSuccess: (deletedRoot: RrRoot) => {
        router.push("/");
        queryClient.invalidateQueries({ queryKey: ["publicRrRoots"] });
        queryClient.invalidateQueries({ queryKey: ["rrRoots"] });
        toast.success("删除成功", {
          position: "top-center",
          description: `成功删除 ${deletedRoot.title}`,
        });
      },
      onError: (err: unknown) => {
        toast.error("删除失败", {
          position: "top-center",
          description: JSON.stringify(err),
        });
      },
    });
  }, [deleteRrRoot, queryClient, router]);

  return {
    isDialogOpen,
    setIsDialogOpen,
    isRootDeleting,
    handleDeleteRoot,
  };
}
