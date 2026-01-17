"use client";

import { Database, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BaseDeleteDialog,
  BaseDialog,
  BaseDialogTrigger,
} from "@/components/dialogs";
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
  isExportDialogOpen: boolean;
  setIsExportDialogOpen: (open: boolean) => void;
  isExporting: boolean;
  handleExportToRag: () => void;
}

export function RrRootItemDropdown({
  rrRoot,
  isEditing,
  setIsEditing,
  isDialogOpen,
  setIsDialogOpen,
  isRootDeleting,
  handleDeleteRoot,
  isExportDialogOpen,
  setIsExportDialogOpen,
  isExporting,
  handleExportToRag,
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
        <BaseDialog
          open={isExportDialogOpen}
          onOpenChange={setIsExportDialogOpen}
          trigger={<BaseDialogTrigger title="导入知识库" Icon={Database} />}
          title="确认导入知识库"
          description={`确定要将 "${rrRoot.title}" 导入知识库吗？这将把该项目的所有内容转换为文档并上传到 RAG 系统。`}
          confirmText="导入"
          onConfirm={handleExportToRag}
          disabled={isExporting}
        />
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
