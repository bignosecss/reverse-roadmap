"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComponent } from "./header/sidebar-header";
import { SidebarContentComponent } from "./content/sidebar-content";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="flex flex-col">
      <SidebarHeaderComponent />
      <SidebarContentComponent />
    </Sidebar>
  );
}
