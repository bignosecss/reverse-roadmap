"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComponent } from "./sidebar-header";
import { SidebarCustomContent } from "./sidebar-content";
import { SidebarFooterComponent } from "./sidebar-footer";
import { useGetAllRrRoots } from "@/lib/service/rrRootApi";

export function AppSidebar() {
  const { data: rrRoots, isLoading } = useGetAllRrRoots();

  return (
    <Sidebar collapsible="icon" className="flex flex-col">
      <SidebarHeaderComponent />
      <SidebarCustomContent rrRoots={rrRoots} isLoading={isLoading} />
      <div className="mt-auto">
        <SidebarFooterComponent />
      </div>
    </Sidebar>
  );
}
