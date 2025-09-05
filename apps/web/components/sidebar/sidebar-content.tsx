"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import type { RrRoot } from "@/lib/types/models";
import SidebarTreeItem from "./sidebar-content-item";

interface SidebarCustomContentProps {
  rrRoots: RrRoot[];
  isLoading: boolean;
  isError: boolean;
}

export function SidebarCustomContent({
  rrRoots,
  isLoading,
  isError,
}: SidebarCustomContentProps) {
  const pathname = usePathname();

  // 直接从URL派生当前选中的树ID，消除冗余状态
  const currentTreeId = pathname.startsWith("/g/")
    ? pathname.split("/g/")[1]
    : null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: No data</div>;
  }

  return (
    <SidebarContent className="group-data-[collapsible=icon]:hidden">
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground group-data-[collapsible=icon]:hidden">
          目标
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {rrRoots.map((rrRoot: RrRoot) => (
              <SidebarTreeItem
                key={rrRoot._id}
                rrRoot={rrRoot}
                isActive={currentTreeId === rrRoot.treeRootNodeId}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
