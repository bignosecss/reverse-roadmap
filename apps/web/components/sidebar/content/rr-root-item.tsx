"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { RrRoot } from "@/lib/types/models";
import { useDeleteRrRoot, useUpdateRrRoot } from "@/hooks/use-rr-root";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useCanvasStore from "@/lib/stores/canvas";
import { BaseDeleteDialog } from "@/components/dialogs/base-delete-dialog";
import { useRouter } from "next/navigation";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SidebarProjectItemProps {
  rrRoot: RrRoot;
  isActive: boolean;
}

export function RrRootItem({ rrRoot, isActive }: SidebarProjectItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(rrRoot.title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setCanvasOpen = useCanvasStore((state) => state.setCanvasOpen);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setEditValue(rrRoot.title);
  }, [rrRoot.title]);

  const queryClient = useQueryClient();
  const { mutateAsync: updateRrRootAsync, isPending: isRootUpdating } =
    useUpdateRrRoot(rrRoot._id);

  const handleEnter = useCallback(async () => {
    // 乐观更新
    const prev = queryClient.getQueryData<RrRoot[] | undefined>(["rrRoots"]);
    queryClient.setQueryData(["rrRoots"], (old: RrRoot[]) =>
      old.map((r) => (r._id === rrRoot._id ? { ...r, title: editValue } : r)),
    );
    try {
      await updateRrRootAsync({ title: editValue });
      toast.success("重命名成功", {
        position: "top-center",
      });
    } catch (err: unknown) {
      // 回滚
      queryClient.setQueryData(["rrRoots"], prev);
      // 显示错误
      toast.error("重命名失败", {
        description: JSON.stringify(err),
      });
    }
    // 防止 isEditing 状态变化导致提交修改后，仍然渲染旧的 title
    setIsEditing(false);
  }, [editValue, queryClient, rrRoot._id, updateRrRootAsync]);

  const router = useRouter();
  const { mutate: deleteRrRoot, isPending: isRootDeleting } = useDeleteRrRoot(
    rrRoot._id,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        {!isEditing ? (
          <Link
            href={`/g/${rrRoot.rootRrNode}`}
            onClick={() => {
              if (!isActive) setCanvasOpen(false);
            }}
            onDoubleClick={() => setIsEditing(true)}
          >
            <span className="group-data-[collapsible=icon]:hidden">
              {rrRoot.title}
            </span>
          </Link>
        ) : (
          <Input
            ref={inputRef}
            autoFocus
            type="text"
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleBlur();
              if (e.key === "Enter") handleEnter();
            }}
            onBlur={handleBlur}
            disabled={isRootUpdating}
          />
        )}
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover className="cursor-pointer">
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuItem
            onSelect={() => {
              if (isEditing) return;
              setIsEditing(true);
            }}
          >
            <Edit2 />
            <span>重命名</span>
          </DropdownMenuItem>
          <BaseDeleteDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            trigger={
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 />
                  <span>删除</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            }
            title="确定要删除吗？"
            description={`此次操作无法撤销。这将永久删除该项目 "${rrRoot.title}"；以及所有相关数据。`}
            onConfirm={handleDeleteRoot}
            disabled={isRootDeleting}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
