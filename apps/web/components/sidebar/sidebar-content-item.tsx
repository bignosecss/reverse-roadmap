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
import { useUpdateRrRoot } from "@/hooks/use-rr-root";

interface SidebarProjectItemProps {
  rrRoot: RrRoot;
  isActive: boolean;
}

export default function SidebarTreeItem({
  rrRoot,
  isActive,
}: SidebarProjectItemProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  const { mutate: updateRrRoot, isPending } = useUpdateRrRoot(rrRoot._id);
  const handleEnter = useCallback(() => {
    updateRrRoot(
      {
        title: editValue,
      },
      {
        onSuccess: () => setIsEditing(false),
        onError: handleBlur,
      },
    );
  }, [editValue, handleBlur, updateRrRoot]);

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
              if (e.key === "Escape") handleBlur()
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
          <DropdownMenuItem variant="destructive">
            <Trash2 />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
