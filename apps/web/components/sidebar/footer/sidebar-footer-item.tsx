"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseDialog } from "@/components/dialogs";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { FooterMenuItem } from "./constants";
import { BaseDialogTrigger } from "@/components/dialogs/base-dialog-trigger";
import { RrRootStatus } from "@/lib/types/models";
import { useSwitchModeDialog } from "../hooks/use-switch-mode-dialog";

interface SidebarFooterItemProps {
  item: FooterMenuItem;
}

export function SidebarFooterItem({ item }: SidebarFooterItemProps) {
  const {
    isDialogOpen,
    handleOpenChange,
    password,
    setPassword,
    handleConfirm,
    isFormValid,
    dialogTitle,
    dialogDescription,
    mode,
  } = useSwitchModeDialog();

  return (
    <SidebarMenuItem>
      <BaseDialog
        open={isDialogOpen}
        onOpenChange={handleOpenChange}
        trigger={<BaseDialogTrigger title={item.title} Icon={item.icon} />}
        title={dialogTitle}
        description={dialogDescription}
        confirmText="切换"
        onConfirm={handleConfirm}
        disabled={!isFormValid}
      >
        {mode === RrRootStatus.public && (
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
        )}
      </BaseDialog>
    </SidebarMenuItem>
  );
}
