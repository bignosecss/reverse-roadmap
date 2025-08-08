"use client";

import { useState, useEffect } from "react";
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
import { getRrRoots } from "@/lib/api";

export function SidebarCustomContent() {
  const [projects, setProjects] = useState<RrRoot[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await getRrRoots();

        if (!res || !res.success || !res.data) {
          throw new Error(res.error);
        }

        setProjects(res.data);
      } catch (error) {
        console.error("获取项目列表失败:", error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground">
          Overview
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {projects.map((item: RrRoot) => (
              <SidebarMenuItem key={item._id}>
                <SidebarMenuButton asChild>
                  <Link href={`/g/${item._id}`}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* todo: show on hover even when the menu is focused */}
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
