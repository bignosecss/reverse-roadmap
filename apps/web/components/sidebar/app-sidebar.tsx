import { Sidebar } from "@/components/ui/sidebar";
import { SidebarHeaderComponent } from "./sidebar-header";
import { SidebarCustomContent } from "./sidebar-content";
import { SidebarFooterComponent } from "./sidebar-footer";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeaderComponent />
      <SidebarCustomContent />
      <SidebarFooterComponent />
    </Sidebar>
  );
}

// Re-export individual components for flexibility
export { SidebarHeaderComponent } from "./sidebar-header";
export { SidebarCustomContent } from "./sidebar-content";
export { SidebarFooterComponent } from "./sidebar-footer";
export { HEAD_MENU_ITEMS, type HeadMenuItem } from "./constants";
