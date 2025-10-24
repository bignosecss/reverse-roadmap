import { DialogConfig, DialogMode } from "@/lib/types/dialog";
import { FitViewOptions } from "@xyflow/react";

// 各模式的配置
export const DIALOG_CONFIGS: Record<DialogMode, DialogConfig> = {
  add: {
    title: "添加",
    description: "新建一个目标树或节点",
    confirmText: "添加",
    cancelText: "取消",
    variant: "default",
  },
  edit: {
    title: "编辑",
    description: "修改当前信息",
    confirmText: "保存",
    cancelText: "取消",
    variant: "default",
  },
  delete: {
    title: "删除节点",
    description: "确定要删除吗？此操作无法撤销。",
    confirmText: "删除",
    cancelText: "取消",
    variant: "destructive",
  },
};

// fitView 配置
export const FIT_VIEW_OPTIONS: FitViewOptions = {
  duration: 600,
};
