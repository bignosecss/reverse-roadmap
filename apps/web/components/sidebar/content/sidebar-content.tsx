"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { RrRootsList } from "./rr-roots-list";

export function SidebarCustomContent() {
  return (
    <SidebarContent className="group-data-[collapsible=icon]:hidden">
      <SidebarGroup>
        <SidebarGroupLabel className="text-muted-foreground group-data-[collapsible=icon]:hidden">
          目标
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <RrRootsList />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
