# Zustand 状态管理指南

## 什么是状态管理？

状态管理就是管理应用程序中的数据。想象一下，你的应用就像一个大房子，状态就是房子里的所有物品 - 灯的开关状态、温度设置、音响音量等。状态管理库就是帮你统一管理这些"物品"的工具。

## 为什么需要状态管理？

在 React 中，组件之间共享数据很麻烦：

- 父子组件传递 props 很简单
- 但兄弟组件、远距离组件传递数据就需要"状态提升"到共同父组件
- 当应用变大时，这会导致 props drilling（属性钻取）问题

状态管理库解决了这个问题：**任何组件都可以直接访问和修改全局状态**。

## Zustand 基础概念

### 1. 最简单的 Store

```typescript
import { create } from "zustand";

// 定义状态类型
interface BearState {
  bears: number;
  increase: () => void;
  decrease: () => void;
}

// 创建 store
const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  decrease: () => set((state) => ({ bears: state.bears - 1 })),
}));
```

### 2. 在组件中使用

```typescript
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increase = useBearStore((state) => state.increase)
  const decrease = useBearStore((state) => state.decrease)
  return (
    <>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </>
  )
}
```

## 分析你的 sidebar-store.ts

让我们看看你的代码：

```typescript
interface SidebarState {
  selectedTreeId: string | null; // 状态：当前选中的树ID
  setSelectedTreeId: (id: string | null) => void; // 动作：设置选中的树ID
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    // 持久化中间件
    (set) => ({
      selectedTreeId: null, // 初始状态
      setSelectedTreeId: (id: string | null) => set({ selectedTreeId: id }), // 更新函数
    }),
    {
      name: "sidebar-storage", // localStorage 中的键名
      partialize: (state: SidebarState) => ({
        // 只持久化 selectedTreeId
        selectedTreeId: state.selectedTreeId,
      }),
    },
  ),
);
```

### 代码质量分析（Linus 视角）

**✅ 好的地方：**

- 类型定义清晰
- 使用了 persist 中间件，用户体验好
- partialize 配置合理，只持久化必要的状态
- 命名简洁明了

**🟡 可以改进的地方：**

- 当前只有一个状态，结构过于简单
- 没有复杂的业务逻辑，可能不需要状态管理

## 如何扩展状态？

当你需要管理更多状态时，有几种扩展方式：

### 方式1：直接在同一个 Store 中添加

```typescript
interface SidebarState {
  // 现有状态
  selectedTreeId: string | null;

  // 新增状态
  isCollapsed: boolean;
  searchQuery: string;
  favoriteTreeIds: string[];

  // 现有动作
  setSelectedTreeId: (id: string | null) => void;

  // 新增动作
  toggleCollapse: () => void;
  setSearchQuery: (query: string) => void;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  clearSearch: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // 初始状态
      selectedTreeId: null,
      isCollapsed: false,
      searchQuery: "",
      favoriteTreeIds: [],

      // 动作实现
      setSelectedTreeId: (id) => set({ selectedTreeId: id }),

      toggleCollapse: () =>
        set((state) => ({
          isCollapsed: !state.isCollapsed,
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      addToFavorites: (id) =>
        set((state) => ({
          favoriteTreeIds: [...state.favoriteTreeIds, id],
        })),

      removeFromFavorites: (id) =>
        set((state) => ({
          favoriteTreeIds: state.favoriteTreeIds.filter((fId) => fId !== id),
        })),

      clearSearch: () => set({ searchQuery: "" }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        selectedTreeId: state.selectedTreeId,
        isCollapsed: state.isCollapsed,
        favoriteTreeIds: state.favoriteTreeIds,
        // 注意：searchQuery 不持久化，每次重新打开应用都是空的
      }),
    },
  ),
);
```

### 方式2：使用 Slices 模式（推荐）

当状态变得复杂时，可以将不同的功能拆分成 "slices"：

```typescript
// slices/selection-slice.ts
export interface SelectionSlice {
  selectedTreeId: string | null;
  setSelectedTreeId: (id: string | null) => void;
}

export const createSelectionSlice: StateCreator<
  SidebarState,
  [],
  [],
  SelectionSlice
> = (set) => ({
  selectedTreeId: null,
  setSelectedTreeId: (id) => set({ selectedTreeId: id }),
});

// slices/ui-slice.ts
export interface UISlice {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const createUISlice: StateCreator<SidebarState, [], [], UISlice> = (
  set,
) => ({
  isCollapsed: false,
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
});

// slices/search-slice.ts
export interface SearchSlice {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export const createSearchSlice: StateCreator<
  SidebarState,
  [],
  [],
  SearchSlice
> = (set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: "" }),
});

// sidebar-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectionSlice, SelectionSlice } from "./slices/selection-slice";
import { createUISlice, UISlice } from "./slices/ui-slice";
import { createSearchSlice, SearchSlice } from "./slices/search-slice";

type SidebarState = SelectionSlice & UISlice & SearchSlice;

export const useSidebarStore = create<SidebarState>()(
  persist(
    (...a) => ({
      ...createSelectionSlice(...a),
      ...createUISlice(...a),
      ...createSearchSlice(...a),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        selectedTreeId: state.selectedTreeId,
        isCollapsed: state.isCollapsed,
      }),
    },
  ),
);
```

### 方式3：多个独立的 Store

如果功能完全不相关，可以创建多个独立的 store：

```typescript
// stores/sidebar-store.ts - 侧边栏相关
export const useSidebarStore = create<SidebarState>()(/* ... */);

// stores/user-store.ts - 用户相关
export const useUserStore = create<UserState>()(/* ... */);

// stores/theme-store.ts - 主题相关
export const useThemeStore = create<ThemeState>()(/* ... */);
```

## 在组件中使用扩展后的 Store

```typescript
function Sidebar() {
  // 选择性订阅，只有相关状态变化时才重新渲染
  const selectedTreeId = useSidebarStore((state) => state.selectedTreeId)
  const isCollapsed = useSidebarStore((state) => state.isCollapsed)
  const searchQuery = useSidebarStore((state) => state.searchQuery)

  // 获取动作
  const { setSelectedTreeId, toggleCollapse, setSearchQuery } = useSidebarStore()

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button onClick={toggleCollapse}>
        {isCollapsed ? '展开' : '收起'}
      </button>

      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="搜索..."
      />

      {/* 树形结构渲染 */}
    </div>
  )
}
```

## 最佳实践

### 1. 状态结构设计

- **扁平化**：避免深层嵌套的对象
- **规范化**：复杂数据用 ID 引用，而不是嵌套对象
- **最小化**：只存储必要的状态，派生状态用计算属性

### 2. 动作设计

- **原子性**：每个动作只做一件事
- **纯函数**：不要在动作中执行副作用
- **命名清晰**：动作名要表达意图

### 3. 性能优化

```typescript
// ❌ 错误：会导致不必要的重新渲染
const store = useSidebarStore();

// ✅ 正确：选择性订阅
const selectedTreeId = useSidebarStore((state) => state.selectedTreeId);

// ✅ 更好：使用 shallow 比较多个值
import { shallow } from "zustand/shallow";

const { selectedTreeId, isCollapsed } = useSidebarStore(
  (state) => ({
    selectedTreeId: state.selectedTreeId,
    isCollapsed: state.isCollapsed,
  }),
  shallow,
);
```

### 4. TypeScript 技巧

```typescript
// 使用 Immer 中间件简化复杂状态更新
import { immer } from 'zustand/middleware/immer'

const useStore = create<State>()()
  immer((set) => ({
    todos: [],
    addTodo: (todo) => set((state) => {
      state.todos.push(todo)  // 直接修改，Immer 会处理不可变性
    }),
  }))
)
```

## 总结

Zustand 的核心思想很简单：

1. **定义状态和动作**
2. **创建 store**
3. **在组件中使用**

扩展状态的关键是保持代码的**可读性**和**可维护性**。从简单开始，根据需要逐步扩展。记住 Linus 的话："好的代码是简单的代码"。

你的 `sidebar-store.ts` 已经是一个很好的开始。当需要更多功能时，可以按照上面的模式逐步扩展。
