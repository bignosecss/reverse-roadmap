"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RrRoot } from "@/lib/types/models";

interface SidebarCustomContentProps {
  rrRoots?: RrRoot[];
  isLoading: boolean;
}

interface SidebarProjectItemProps {
  item: RrRoot;
  isActive: boolean;
}

function SidebarTreeItem({ item, isActive }: SidebarProjectItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/g/${item.treeRootNodeId}`}>
          <span className="group-data-[collapsible=icon]:hidden">
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover className="cursor-pointer">
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            <span>Edit Project</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Delete Project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

export function SidebarCustomContent({
  rrRoots,
  isLoading,
}: SidebarCustomContentProps) {
  const pathname = usePathname();

  // 直接从URL派生当前选中的树ID，消除冗余状态
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!rrRoots) {
    return <div>Error: No data</div>;
  }

  return (
    <SidebarContent className="group-data-[collapsible=icon]:hidden">
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground group-data-[collapsible=icon]:hidden">
          Overview
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {rrRoots.map((tree: RrRoot) => (
              <SidebarTreeItem
                key={tree._id}
                item={tree}
                isActive={currentTreeId === tree._id}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
