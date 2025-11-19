"use client";

import { SidebarFooter, SidebarMenu } from "@/components/ui/sidebar";
import useSidebarStore from "@/lib/stores/sidebar";
import { FOOTER_MENU_ITEMS } from "./constants";
import { SidebarFooterItem } from "./sidebar-footer-item";

export function SidebarFooterComponent() {
  const mode = useSidebarStore((state) => state.mode);

  return (
    <SidebarFooter className="mt-auto">
      <SidebarMenu>
        <SidebarFooterItem
          item={FOOTER_MENU_ITEMS.find((i) => i.mode === mode)!}
        />
      </SidebarMenu>
    </SidebarFooter>
  );
}
