"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComponent } from "./sidebar-header";
import { SidebarCustomContent } from "./sidebar-content";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="flex flex-col">
      <SidebarHeaderComponent />
      <SidebarCustomContent />
    </Sidebar>
  );
}
