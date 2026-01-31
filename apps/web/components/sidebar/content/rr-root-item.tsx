"use client";

import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import useCanvasStore from "@/lib/stores/canvas";
import { useRrRootRename } from "@/components/sidebar/hooks/use-rr-root-edit";
import { useRrRootDelete } from "@/components/sidebar/hooks/use-rr-root-delete";
import { useRrRootExport } from "@/components/sidebar/hooks/use-rr-root-export";
import { useEditRootDialog } from "@/components/sidebar/hooks/use-edit-root-dialog";
import { RrRootItemDropdown } from "./rr-root-item-dropdown";
import { RrRoot } from "@repo/shared/models";

interface SidebarProjectItemProps {
  rrRoot: RrRoot;
  isActive: boolean;
}

export function RrRootItem({ rrRoot, isActive }: SidebarProjectItemProps) {
  const setCanvasOpen = useCanvasStore((state) => state.setCanvasOpen);

  const {
    isEditing,
    setIsEditing,
    editValue,
    setEditValue,
    inputRef,
    isRootUpdating,
    handleKeyDown,
    handleBlur,
  } = useRrRootRename(rrRoot);

  const { isDialogOpen, setIsDialogOpen, isRootDeleting, handleDeleteRoot } =
    useRrRootDelete(rrRoot);

  const {
    isDialogOpen: isExportDialogOpen,
    setIsDialogOpen: setIsExportDialogOpen,
    isExporting,
    handleExportToRag,
  } = useRrRootExport(rrRoot);

  const {
    isDialogOpen: isEditDialogOpen,
    handleOpenChange: setIsEditDialogOpen,
    title: editTitle,
    setTitle: setEditTitle,
    status: editStatus,
    setStatus: setEditStatus,
    handleConfirm: handleEditRoot,
    isFormValid: isEditFormValid,
    isPending: isEditPending,
  } = useEditRootDialog(rrRoot);

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
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            disabled={isRootUpdating}
          />
        )}
      </SidebarMenuButton>
      {!isEditing && (
        <RrRootItemDropdown
          rrRoot={rrRoot}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          isRootDeleting={isRootDeleting}
          handleDeleteRoot={handleDeleteRoot}
          isExportDialogOpen={isExportDialogOpen}
          setIsExportDialogOpen={setIsExportDialogOpen}
          isExporting={isExporting}
          handleExportToRag={handleExportToRag}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          handleEditRoot={handleEditRoot}
          isEditPending={isEditPending}
          isEditFormValid={isEditFormValid}
        />
      )}
    </SidebarMenuItem>
  );
}
