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
import { useEffect } from "react";
import type { RrRoot } from "@/lib/types/models";
import { useGetAllRrRoots } from "@/lib/service/rrRootApi";
import { useSidebarStore } from "@/lib/stores/sidebar-store";

interface SidebarProjectItemProps {
  item: RrRoot;
  isActive: boolean;
  onSelect: () => void;
}

function SidebarTreeItem({
  item,
  isActive,
  onSelect,
}: SidebarProjectItemProps) {
  return (
    <SidebarMenuItem onClick={onSelect}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`/g/${item._id}`}>
          <span>{item.title}</span>
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

export function SidebarCustomContent() {
  const { data: rrRoots, isLoading } = useGetAllRrRoots();
  const pathname = usePathname();
  const { selectedTreeId, setSelectedTreeId } = useSidebarStore();

  // 同步路由变化到 Zustand 状态
  useEffect(() => {
    if (pathname.startsWith("/g/")) {
      const currentId = pathname.split("/g/")[1];
      if (currentId && currentId !== selectedTreeId) {
        setSelectedTreeId(currentId);
      }
    }
  }, [pathname, selectedTreeId, setSelectedTreeId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!rrRoots) {
    return <div>Error: No data</div>;
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground">
          Overview
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {rrRoots.map((tree: RrRoot) => (
              <SidebarTreeItem
                key={tree._id}
                item={tree}
                isActive={
                  selectedTreeId === tree._id || pathname === `/g/${tree._id}`
                }
                onSelect={() => setSelectedTreeId(tree._id)}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
