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

// 各模式的配置
export const DIALOG_CONFIGS: Record<DialogMode, DialogConfig> = {
  add: {
    title: "添加节点",
    description: "创建一个新的思维导图节点",
    confirmText: "添加",
    cancelText: "取消",
    variant: "default",
  },
  edit: {
    title: "编辑节点",
    description: "修改当前节点的信息",
    confirmText: "保存",
    cancelText: "取消",
    variant: "default",
  },
  delete: {
    title: "删除节点",
    description: "确定要删除这个节点吗？此操作无法撤销。",
    confirmText: "删除",
    cancelText: "取消",
    variant: "destructive",
  },
};

// Dialog 状态接口
export interface DialogState {
  isOpen: boolean;
  mode: DialogMode | null;
}
