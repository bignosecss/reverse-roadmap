import { ReactNode } from "react";

// 单个 Tab 项的类型定义
export interface TabItem {
  /** 唯一标识（必传，用于匹配内容/操作） */
  id: string;
  /** Tab 显示名称 */
  label: string;
  /** 自定义扩展字段（如接口所需的其他参数） */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Tabs 组件核心 Props
export interface TabsProps {
  /** Tab 列表数据（核心） */
  tabs: TabItem[];
  /** 当前激活的 Tab ID */
  activeTabId: string;
  /** 激活 Tab 变化时的回调 */
  onTabChange: (tabId: string) => void;
  /** 新增 Tab 回调（触发 API 调用） */
  onTabAdd: () => Promise<void>;
  /** 删除 Tab 回调（触发 API 调用） */
  onTabRemove: (tabId: string) => Promise<void>;
  /** 重命名 Tab 回调（触发 API 调用） */
  onTabRename: (tabId: string, newLabel: string) => Promise<void>;
  /** 自定义 Tab 内容渲染（按 ID 匹配） */
  renderTabContent: (tabId: string) => ReactNode;
  /** 可选：是否禁用新增按钮 */
  disableAdd?: boolean;
  /** 可选：是否禁用删除按钮（全局，也可在 TabItem 扩展字段单独控制） */
  disableRemove?: boolean;
  /** 可选：自定义 Tab 列表类名（Tailwind 样式） */
  listClassName?: string;
  /** 可选：自定义内容区域类名（Tailwind 样式） */
  panelClassName?: string;
  /** 可选：激活 Tab 的样式类名（Tailwind 样式） */
  activeTabClassName?: string;
  /** 可选：编辑状态下的输入框类名（Tailwind 样式） */
  editInputClassName?: string;
}

// TabsList 子组件 Props（内部透传）
export interface TabsListProps {
  tabs: TabItem[];
  activeTabId: string;
  editingTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabDoubleClick: (tabId: string) => void;
  onTabRemove: (tabId: string) => void;
  onTabAdd: () => void;
  onEditConfirm: (tabId: string, newLabel: string) => void;
  onEditCancel: () => void;
  disableAdd?: boolean;
  disableRemove?: boolean;
  listClassName?: string;
  activeTabClassName?: string;
  editInputClassName?: string;
}

// TabPanel 子组件 Props（内部透传）
export interface TabPanelProps {
  activeTabId: string;
  renderTabContent: (tabId: string) => ReactNode;
  panelClassName?: string;
}

export interface TabEditInputProps {
  initialValue: string;
  onConfirm: (newValue: string) => void;
  onCancel: () => void;
  className?: string;
}
