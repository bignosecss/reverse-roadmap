"use client";

import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { RrRoot, RrRootStatus } from "@/lib/types/models";
import useCanvasStore from "@/lib/stores/canvas";
import { useRrRootEdit } from "@/components/sidebar/hooks/use-rr-root-edit";
import { useRrRootDelete } from "@/components/sidebar/hooks/use-rr-root-delete";
import { RrRootItemDropdown } from "./rr-root-item-dropdown";

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
    mode,
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
        <RrRootItemDropdown
          rrRoot={rrRoot}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          isRootDeleting={isRootDeleting}
          handleDeleteRoot={handleDeleteRoot}
        />
      )}
    </SidebarMenuItem>
  );
}
