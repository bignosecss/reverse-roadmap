"use client";

import { KeyRound, LogOut } from "lucide-react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useSidebarStore from "@/lib/stores/sidebar";
import { useState } from "react";
import { PasswordDialog } from "../dialogs/password-dialog";
import { toast } from "sonner";
import { RrRootStatus } from "@/lib/types/models";

export function SidebarFooterComponent() {
  const mode = useSidebarStore((state) => state.mode);
  const toggleMode = useSidebarStore((state) => state.toggleMode);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handlePasswordConfirm = (password: string) => {
    // todo: 密码存储到本地的环境变量文件里
    if (password === "123456") {
      toggleMode(RrRootStatus.private);
      toast.success("已切换到私有模式");
      setIsPasswordDialogOpen(false);
    } else {
      toast.error("密码错误");
    }
  };

  return (
    <SidebarFooter className="mt-auto">
      <SidebarMenu>
        {mode === RrRootStatus.public ? (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setIsPasswordDialogOpen(true)}>
              <KeyRound />
              <span className="group-data-[collapsible=icon]:hidden">
                私有模式
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => toggleMode(RrRootStatus.public)}>
              <LogOut />
              <span className="group-data-[collapsible=icon]:hidden">
                公开模式
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
      <PasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onConfirm={handlePasswordConfirm}
      />
    </SidebarFooter>
  );
}
