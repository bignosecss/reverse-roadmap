"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseDialog } from "@/components/ui/base-dialog";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => void;
  onCancel?: () => void;
}

export function PasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}: PasswordDialogProps) {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open) {
      setPassword("");
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm(password);
  };

  const isFormValid = password.trim().length > 0;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="输入密码"
      description="请输入密码以查看私有内容"
      confirmText="确认"
      cancelText="取消"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      confirmDisabled={!isFormValid}
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
  );
}
