"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { useUpdateRrRoot, useDeleteRrRoot } from "@/hooks/use-rr-root";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { useRouter } from "next/navigation";

interface SidebarProjectItemProps {
  rrRoot: RrRoot;
  isActive: boolean;
}

export default function SidebarTreeItem({
  rrRoot,
  isActive,
}: SidebarProjectItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editValue, setEditValue] = useState(rrRoot.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [isEditing]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setEditValue(rrRoot.title);
  }, [rrRoot.title]);

  const queryClient = useQueryClient();
  const { mutateAsync: updateRrRootAsync, isPending } = useUpdateRrRoot(
    rrRoot._id,
  );
  const { mutateAsync: deleteRrRootAsync } = useDeleteRrRoot(rrRoot._id);
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
  const handleDelete = useCallback(async () => {
    try {
      await deleteRrRootAsync();
      toast.success("删除成功", {
        position: "top-center",
      });
      router.push("/");
    } catch (err: unknown) {
      toast.error("删除失败", {
        description: JSON.stringify(err),
      });
    }
  }, [deleteRrRootAsync, router]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        {!isEditing ? (
          <Link href={`/g/${rrRoot.treeRootNodeId}`}>
            <span className="group-data-[collapsible=icon]:hidden">
              {rrRoot.title}
            </span>
          </Link>
        ) : (
          <Input
            ref={inputRef}
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
            disabled={isPending}
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
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Edit2 />
            <span>重命名</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="删除目标"
        description={`确定要删除目标 "${rrRoot.title}" 吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        variant="destructive"
      />
    </SidebarMenuItem>
  );
}
