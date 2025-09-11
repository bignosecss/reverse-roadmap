"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComponent } from "./sidebar-header";
import { SidebarCustomContent } from "./sidebar-content";
import { SidebarFooterComponent } from "./sidebar-footer";
import { useGetRrRoots } from "@/hooks/use-rr-root";

export default function AppSidebar() {
  const { data: rrRoots, isLoading, isError } = useGetRrRoots();

  return (
    <Sidebar collapsible="icon" className="flex flex-col">
      <SidebarHeaderComponent />
      <SidebarCustomContent
        rrRoots={rrRoots}
        isLoading={isLoading}
        isError={isError}
      />
      <div className="mt-auto">
        <SidebarFooterComponent />
      </div>
    </Sidebar>
  );
}
