"use client";

import { User, Settings, LogOut } from "lucide-react";
import { SidebarFooter } from "@/components/ui/sidebar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SidebarFooterComponent() {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-row justify-between items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-auto">
                <User className="size-4 shrink-0" />
                <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">用户名</span>
                  <span className="text-xs text-muted-foreground truncate">
                    user@example.com
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
              <DropdownMenuLabel>配置</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="size-4" />
                  <span>个人资料</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4" />
                  <span>设置</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut className="size-4" />
                <span>退出</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
