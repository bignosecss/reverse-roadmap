"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseDialog } from "@/components/dialogs";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { FooterMenuItem } from "./constants";
import useSidebarStore from "@/lib/stores/sidebar";
import { RrRootStatus } from "@/lib/types/models";
import { toast } from "sonner";
import { BaseDialogTrigger } from "@/components/dialogs/base-dialog-trigger";

interface SidebarFooterItemProps {
  item: FooterMenuItem;
}

export function SidebarFooterItem({ item }: SidebarFooterItemProps) {
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setPassword("");
  }, []);

  const mode = useSidebarStore((state) => state.mode);
  const toggleMode = useSidebarStore((state) => state.toggleMode);

  const handleConfirm = useCallback(() => {
    if (mode === RrRootStatus.private) {
      toggleMode(RrRootStatus.public);
      toast.success(`已切换到 ${RrRootStatus.public} 模式`);
      setIsDialogOpen(false);
    } else if (mode === RrRootStatus.public && password === "123qwe") {
      toggleMode(RrRootStatus.private);
      toast.success(`已切换到 ${RrRootStatus.private} 模式`);
      setIsDialogOpen(false);
    } else {
      toast.error("密码错误");
    }
  }, [mode, password, toggleMode]);

  const isFormValid = password.trim().length > 0;

  return (
    <SidebarMenuItem>
      <BaseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        trigger={
          <SidebarMenuButton asChild>
            <BaseDialogTrigger title={item.title} Icon={item.icon} />
          </SidebarMenuButton>
        }
        title="输入密码"
        description="请输入密码以查看私有内容"
        confirmText="切换"
        onConfirm={handleConfirm}
        disabled={!isFormValid}
      >
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
        </div>
      </BaseDialog>
    </SidebarMenuItem>
  );
}
