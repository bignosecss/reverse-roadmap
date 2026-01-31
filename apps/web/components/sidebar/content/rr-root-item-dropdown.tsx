"use client";

import { Database, MoreHorizontal, Settings, Trash2 } from "lucide-react";
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
import { RrRoot, RrRootStatus } from "@repo/shared/models";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface RrRootItemDropdownProps {
  rrRoot: RrRoot;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isRootDeleting: boolean;
  handleDeleteRoot: () => void;
  isExportDialogOpen: boolean;
  setIsExportDialogOpen: (open: boolean) => void;
  isExporting: boolean;
  handleExportToRag: () => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editStatus: RrRootStatus;
  setEditStatus: (status: RrRootStatus) => void;
  handleEditRoot: () => void;
  isEditPending: boolean;
  isEditFormValid: boolean;
}

export function RrRootItemDropdown({
  rrRoot,
  isDialogOpen,
  setIsDialogOpen,
  isRootDeleting,
  handleDeleteRoot,
  isExportDialogOpen,
  setIsExportDialogOpen,
  isExporting,
  handleExportToRag,
  isEditDialogOpen,
  setIsEditDialogOpen,
  editTitle,
  setEditTitle,
  editStatus,
  setEditStatus,
  handleEditRoot,
  isEditPending,
  isEditFormValid,
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
        <BaseDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          trigger={<BaseDialogTrigger title="编辑目标" Icon={Settings} />}
          title="编辑目标"
          description={`编辑目标 "${rrRoot.title}" 的信息`}
          confirmText="保存"
          onConfirm={handleEditRoot}
          disabled={!isEditFormValid || isEditPending}
        >
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="edit-root-title">目标标题 *</Label>
              <Input
                id="edit-root-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="请输入目标标题"
              />
            </div>
            <div className="grid gap-3">
              <Label>模式</Label>
              <ToggleGroup
                type="single"
                value={editStatus}
                onValueChange={(value) => {
                  if (value) setEditStatus(value as RrRootStatus);
                }}
                className="justify-start"
              >
                <ToggleGroupItem
                  value={RrRootStatus.archived}
                  aria-label="Archived"
                >
                  归档
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={RrRootStatus.active}
                  aria-label="Active"
                >
                  活跃
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </BaseDialog>
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
