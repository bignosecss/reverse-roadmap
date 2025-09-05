// Dialog 模式类型定义
export type DialogMode = "add" | "edit" | "delete";

// Dialog 配置接口
export interface DialogConfig {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: "default" | "destructive";
}

// Dialog 状态接口
export interface DialogState {
  isOpen: boolean;
  mode: DialogMode | null;
}
