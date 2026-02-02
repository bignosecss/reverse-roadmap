import { useCallback, useRef, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUpdateRrRoot } from "../../../hooks/use-rr-root";
import { RrRoot } from "@repo/shared/models";

export function useRrRootRename(rrRoot: RrRoot) {
  const rootsQueryKey = "rrRoots";
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(rrRoot.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const queryClient = useQueryClient();
  const { mutateAsync: updateRrRootAsync, isPending: isRootUpdating } =
    useUpdateRrRoot(rrRoot._id);

  const handleEnter = useCallback(async () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue === "" || trimmedValue === rrRoot.title) {
      setIsEditing(false);
      setEditValue(rrRoot.title);
      return;
    }

    const previousRrRoots = queryClient.getQueryData<RrRoot[]>([rootsQueryKey]);
    queryClient.setQueryData([rootsQueryKey], (old: RrRoot[] | undefined) =>
      old
        ? old.map((r) =>
            r._id === rrRoot._id ? { ...r, title: trimmedValue } : r,
          )
        : [],
    );

    try {
      await updateRrRootAsync({ title: trimmedValue, status: rrRoot.status });
      toast.success("重命名成功", {
        position: "top-center",
      });
      await queryClient.invalidateQueries({ queryKey: [rootsQueryKey] });
    } catch (err: unknown) {
      // Rollback on error
      if (previousRrRoots) {
        queryClient.setQueryData([rootsQueryKey], previousRrRoots);
      }
      toast.error("重命名失败", {
        description: JSON.stringify(err),
      });
    } finally {
      setIsEditing(false);
    }
  }, [
    editValue,
    queryClient,
    rootsQueryKey,
    rrRoot._id,
    rrRoot.title,
    updateRrRootAsync,
  ]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setEditValue(rrRoot.title);
  }, [rrRoot.title]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") handleBlur();
      if (e.key === "Enter") handleEnter();
    },
    [handleBlur, handleEnter],
  );

  return {
    isEditing,
    setIsEditing,
    editValue,
    setEditValue,
    inputRef,
    isRootUpdating,
    handleKeyDown,
    handleBlur,
  };
}
