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
import type { RrRoot } from "@/lib/types/models";
import { useGetAllRrRoots } from "@/lib/service/rrRootApi";

export function SidebarCustomContent() {
  const { data: rrRoots, isLoading } = useGetAllRrRoots();

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
            {rrRoots.map((item: RrRoot) => (
              <SidebarMenuItem key={item._id}>
                <SidebarMenuButton asChild>
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
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
