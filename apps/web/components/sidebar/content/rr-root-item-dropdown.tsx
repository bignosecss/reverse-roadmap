"use client";

import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BaseDeleteDialog } from "@/components/dialogs";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RrRoot } from "@repo/shared/models";

interface RrRootItemDropdownProps {
  rrRoot: RrRoot;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isRootDeleting: boolean;
  handleDeleteRoot: () => void;
}

export function RrRootItemDropdown({
  rrRoot,
  isEditing,
  setIsEditing,
  isDialogOpen,
  setIsDialogOpen,
  isRootDeleting,
  handleDeleteRoot,
}: RrRootItemDropdownProps) {
  return (
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
  );
}
