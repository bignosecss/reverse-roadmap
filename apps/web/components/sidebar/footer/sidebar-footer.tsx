"use client";

import { User, Settings, LogOut, Eye } from "lucide-react";
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
import useAuthStore from "@/lib/stores/auth";
import { useRouter } from "next/navigation";

export function SidebarFooterComponent() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  if (!user) {
    return (
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push("/login")}
              tooltip="点击登录"
            >
              <Eye className="size-4 shrink-0" />
              <span className="text-sm font-medium">浏览模式</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    );
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-row justify-between items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="">
                <User className="size-4 shrink-0" />
                <div className="flex flex-col text-left relative whitespace-nowrap transition-all duration-200 ease-linear group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:-translate-x-2 overflow-hidden">
                  <span className="text-sm font-medium">用户名</span>
                  <span className="text-xs text-muted-foreground truncate">
                    user@example.com
                  </span>
                  {/* 文字渐变消失效果 */}
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-background opacity-0 group-data-[collapsible=icon]:opacity-100 transition-opacity duration-200 ease-linear" />
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
