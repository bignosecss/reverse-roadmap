# 简化 Sidebar Store - 回到基础

## 你的观点完全正确！

对于当前项目的复杂度，使用 `persist` + `partialize` 确实是过度工程化了。让我们回到最基础的 Zustand 用法。

## 当前代码的问题

```typescript
// 当前的代码 - 过于复杂
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      selectedTreeId: null,
      setSelectedTreeId: (id: string | null) => set({ selectedTreeId: id }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state: SidebarState) => ({
        selectedTreeId: state.selectedTreeId,
      }),
    },
  ),
);
```

**问题分析：**

1. **persist** - 为一个简单的选中状态添加持久化，用户刷新页面重新选择也很正常
2. **partialize** - 只有一个字段，完全没必要
3. **复杂的中间件嵌套** - 增加了学习成本和维护成本

## 最简化方案

```typescript
import { create } from "zustand";

interface SidebarState {
  selectedTreeId: string | null;
  setSelectedTreeId: (id: string | null) => void;
}

// 最简单的 Zustand store
export const useSidebarStore = create<SidebarState>((set) => ({
  selectedTreeId: null,
  setSelectedTreeId: (id: string | null) => set({ selectedTreeId: id }),
}));
```

**这就够了！**

## 为什么这样更好？

### 1. 符合当前需求

- 只需要记住用户选中了哪个树节点
- 页面刷新重新选择很正常，不需要持久化
- 代码清晰易懂

### 2. 学习友好

- 这是 Zustand 最基础的用法
- 没有中间件的复杂性
- 容易理解和调试

### 3. 性能更好

- 没有持久化的序列化/反序列化开销
- 没有额外的中间件处理
- 更快的状态更新

### 4. 维护简单

- 代码行数更少
- 没有配置项
- 出问题容易排查

## 在组件中使用

```typescript
// 在组件中使用 - 完全一样
import { useSidebarStore } from '@/lib/stores/sidebar-store';

function TreeNode({ id, name }: { id: string; name: string }) {
  const { selectedTreeId, setSelectedTreeId } = useSidebarStore();

  return (
    <div
      className={`cursor-pointer p-2 ${
        selectedTreeId === id ? 'bg-blue-100' : 'hover:bg-gray-50'
      }`}
      onClick={() => setSelectedTreeId(id)}
    >
      {name}
    </div>
  );
}
```

## 什么时候再考虑添加功能？

### 只有在真正需要时才添加：

1. **用户明确要求**记住选中状态 → 添加 `persist`
2. **状态变得复杂**（多个字段）→ 考虑 `partialize`
3. **需要调试状态**变化 → 添加 `devtools`

### 渐进式添加示例：

```typescript
// 第一步：基础版本（当前推荐）
export const useSidebarStore = create<SidebarState>((set) => ({
  selectedTreeId: null,
  setSelectedTreeId: (id) => set({ selectedTreeId: id }),
}));

// 第二步：如果真的需要持久化
export const useSidebarStore = create<SidebarState>()()
  persist(
    (set) => ({
      selectedTreeId: null,
      setSelectedTreeId: (id) => set({ selectedTreeId: id }),
    }),
    { name: "sidebar-storage" }
  )
);

// 第三步：如果状态变复杂了
export const useSidebarStore = create<SidebarState>()()
  persist(
    (set) => ({
      selectedTreeId: null,
      isCollapsed: false,
      favoriteIds: [],
      setSelectedTreeId: (id) => set({ selectedTreeId: id }),
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({ selectedTreeId: state.selectedTreeId }), // 只持久化重要的
    }
  )
);
```

## Linus 的观点

> "简单是终极的复杂。"

你的直觉是对的：

- **Keep it simple** - 不要为了使用技术而使用技术
- **YAGNI** (You Aren't Gonna Need It) - 不要实现你不需要的功能
- **循序渐进** - 从最简单的开始，需要时再扩展

## 建议的修改

将你的 `sidebar-store.ts` 简化为：

```typescript
import { create } from "zustand";

interface SidebarState {
  selectedTreeId: string | null;
  setSelectedTreeId: (id: string | null) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  selectedTreeId: null,
  setSelectedTreeId: (id: string | null) => set({ selectedTreeId: id }),
}));
```

**这就是最好的开始！**

当你真正需要持久化或其他功能时，再一步步添加。现在保持简单，专注于学习 Zustand 的核心概念。
