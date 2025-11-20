"use client";

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
import { RrRoot, RrRootStatus } from "@/lib/types/models";
import useCanvasStore from "@/lib/stores/canvas";
import { BaseDeleteDialog } from "@/components/dialogs/base-delete-dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRrRootEdit } from "@/components/sidebar/hooks/use-rr-root-edit";
import { useRrRootDelete } from "@/components/sidebar/hooks/use-rr-root-delete";
import useSidebarStore from "@/lib/stores/sidebar";

interface SidebarProjectItemProps {
  rrRoot: RrRoot;
  isActive: boolean;
}

export function RrRootItem({ rrRoot, isActive }: SidebarProjectItemProps) {
  const setCanvasOpen = useCanvasStore((state) => state.setCanvasOpen);
  const mode = useSidebarStore((state) => state.mode);

  const {
    isEditing,
    setIsEditing,
    editValue,
    setEditValue,
    inputRef,
    isRootUpdating,
    handleKeyDown,
    handleBlur,
  } = useRrRootEdit(rrRoot);

  const { isDialogOpen, setIsDialogOpen, isRootDeleting, handleDeleteRoot } =
    useRrRootDelete(rrRoot);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        {!isEditing ? (
          <Link
            href={`/g/${rrRoot.rootRrNode}`}
            onClick={() => {
              if (!isActive) setCanvasOpen(false);
            }}
            onDoubleClick={() => {
              if (mode === RrRootStatus.private) setIsEditing(true);
            }}
          >
            <span className="group-data-[collapsible=icon]:hidden">
              {rrRoot.title}
            </span>
          </Link>
        ) : (
          <Input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={isRootUpdating}
          />
        )}
      </SidebarMenuButton>
      {mode === RrRootStatus.private && (
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
      )}
    </SidebarMenuItem>
  );
}
