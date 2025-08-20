import Link from "next/link";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HEAD_MENU_ITEMS } from "./constants";

export function SidebarHeaderComponent() {
  return (
    <SidebarHeader className="relative">
      <SidebarMenu>
        <SidebarMenuItem>
          {/* 展开状态：显示logo和文本，SidebarTrigger在右侧 */}
          <div className="group-data-[collapsible=icon]:hidden">
            <Link href="/" className="flex items-center gap-2 px-2 py-1.5">
              <span>Reverse Roadmap</span>
            </Link>
            <SidebarTrigger className="absolute right-2 top-1/2 -translate-y-1/2" />
          </div>

          {/* 折叠状态：在logo位置显示SidebarTrigger */}
          <div className="group-data-[collapsible=icon]:block hidden">
            <SidebarTrigger className="flex items-center justify-center w-full px-2 py-1.5" />
          </div>
        </SidebarMenuItem>
        {HEAD_MENU_ITEMS.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarHeader>
  );
}
