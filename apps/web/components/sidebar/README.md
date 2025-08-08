# Sidebar Components

这个目录包含了重构后的侧边栏组件，将原本的单一 `app-sidebar.tsx` 文件拆分为多个职责单一的组件。

## 文件结构

```
sidebar/
├── app-sidebar.tsx       # 主入口文件，组合所有组件
├── constants.ts          # 共享常量和类型定义
├── sidebar-header.tsx    # 侧边栏头部组件（应用标题 + 主导航）
├── sidebar-overview.tsx  # 概览部分组件（项目列表 + 操作菜单）
├── sidebar-footer.tsx    # 侧边栏底部组件（用户菜单）
└── README.md            # 本文档
```

## 组件说明

### `SidebarHeaderComponent`

- 包含应用标题 "Reverse Roadmap"
- 主导航菜单项（Home, Inbox, Calendar, Search, Settings）
- 每个菜单项都带有图标和链接

### `SidebarOverview`

- 概览部分的内容区域
- 显示项目列表
- 每个项目都有下拉操作菜单（编辑/删除）

### `SidebarFooterComponent`

- 用户信息和账户操作
- 包含用户头像、用户名
- 下拉菜单：Account, Billing, Sign out

### `constants.ts`

- 定义了 `MENU_ITEMS` 常量，避免重复定义
- 导出 `MenuItem` 类型，提供类型安全

## 使用方法

### 基本使用

```tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar";

// 在布局中使用
<AppSidebar />;
```

### 单独使用组件

```tsx
import {
  SidebarHeaderComponent,
  SidebarOverview,
  SidebarFooterComponent,
} from "@/components/sidebar/app-sidebar";

// 自定义组合
<Sidebar>
  <SidebarHeaderComponent />
  <SidebarOverview />
  <SidebarFooterComponent />
</Sidebar>;
```

### 使用常量

```tsx
import { MENU_ITEMS, type MenuItem } from "@/components/sidebar/app-sidebar";

// 在其他组件中复用菜单项
const customMenu = MENU_ITEMS.filter((item) => item.title !== "Settings");
```

## 设计原则

1. **单一职责**: 每个组件只负责一个特定的 UI 区域
2. **可复用性**: 组件可以单独使用或重新组合
3. **类型安全**: 使用 TypeScript 提供完整的类型定义
4. **DRY 原则**: 通过 constants.ts 避免重复定义
5. **向后兼容**: 保持原有的 API 接口不变

## 扩展建议

- 可以为每个组件添加 props 来支持自定义配置
- 考虑添加主题支持
- 可以将菜单项配置外部化，支持动态配置
- 添加国际化支持
