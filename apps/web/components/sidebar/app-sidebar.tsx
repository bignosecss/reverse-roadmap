"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComponent } from "./header/sidebar-header";
import { SidebarContentComponent } from "./content/sidebar-content";
import { SidebarFooterComponent } from "./footer/sidebar-footer";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderComponent />
      <SidebarContentComponent />
      <SidebarFooterComponent />
    </Sidebar>
  );
}
