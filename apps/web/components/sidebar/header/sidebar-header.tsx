import Link from "next/link";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HEAD_MENU_ITEMS } from "./constants";
import { SidebarHeaderItem } from "./sidebar-header-item";
import useSidebarStore from "@/lib/stores/sidebar";
import { RrRootStatus } from "@/lib/types/models";

export function SidebarHeaderComponent() {
  const mode = useSidebarStore((state) => state.mode);

  return (
    <SidebarHeader className="relative">
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-row justify-between items-center  group-data-[collapsible=icon]:justify-center">
          <div className="w-full flex flex-row justify-between p-2 group-data-[collapsible=icon]:justify-center">
            <Link
              href="/"
              className="flex items-center relative whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:hidden"
            >
              Reverse Roadmap
            </Link>
            <SidebarTrigger />
          </div>
        </SidebarMenuItem>
        {mode === RrRootStatus.private &&
          HEAD_MENU_ITEMS.map((item) => (
            <SidebarHeaderItem key={item.operation} item={item} />
          ))}
      </SidebarMenu>
    </SidebarHeader>
  );
}
