import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

type ButtonPropsType = React.ComponentProps<typeof Button>;

interface BaseDialogProps extends ButtonPropsType {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: React.ReactElement;
  title: string;
  description: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export function BaseDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  ...rest
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        {trigger}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{cancelText}</Button>
            </DialogClose>
            <Button type="submit" onClick={onConfirm} {...rest}>
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
