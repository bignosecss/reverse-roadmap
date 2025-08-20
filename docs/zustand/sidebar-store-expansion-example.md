# Sidebar Store 扩展实例

## 当前代码分析

你的 `sidebar-store.ts` 目前很简单，只管理一个状态：

```typescript
// 当前的 sidebar-store.ts
interface SidebarState {
  selectedTreeId: string | null;
  setSelectedTreeId: (id: string | null) => void;
}
```

这是个好的开始！但随着应用功能增加，你可能需要管理更多侧边栏相关的状态。

## 渐进式扩展方案

### 阶段1：添加基础 UI 状态

```typescript
// apps/web/lib/stores/sidebar-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  // 选择状态
  selectedTreeId: string | null;

  // UI 状态
  isCollapsed: boolean;
  width: number;

  // 动作
  setSelectedTreeId: (id: string | null) => void;
  toggleCollapse: () => void;
  setWidth: (width: number) => void;
  resetWidth: () => void;
}

const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // 初始状态
      selectedTreeId: null,
      isCollapsed: false,
      width: DEFAULT_WIDTH,

      // 动作实现
      setSelectedTreeId: (id) => set({ selectedTreeId: id }),

      toggleCollapse: () =>
        set((state) => ({
          isCollapsed: !state.isCollapsed,
        })),

      setWidth: (width) => {
        const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
        set({ width: clampedWidth });
      },

      resetWidth: () => set({ width: DEFAULT_WIDTH }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        selectedTreeId: state.selectedTreeId,
        isCollapsed: state.isCollapsed,
        width: state.width,
        // 注意：不持久化动作函数
      }),
    },
  ),
);
```

### 阶段2：添加搜索和过滤功能

```typescript
// apps/web/lib/stores/sidebar-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  // 选择状态
  selectedTreeId: string | null;

  // UI 状态
  isCollapsed: boolean;
  width: number;

  // 搜索状态
  searchQuery: string;
  searchResults: string[];
  isSearching: boolean;

  // 过滤状态
  filterType: "all" | "favorites" | "recent";
  favoriteTreeIds: string[];
  recentTreeIds: string[];

  // 动作
  setSelectedTreeId: (id: string | null) => void;
  toggleCollapse: () => void;
  setWidth: (width: number) => void;
  resetWidth: () => void;

  // 搜索动作
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  setSearchResults: (results: string[]) => void;
  setIsSearching: (isSearching: boolean) => void;

  // 过滤动作
  setFilterType: (type: "all" | "favorites" | "recent") => void;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  addToRecent: (id: string) => void;
  clearRecent: () => void;
}

const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const MAX_RECENT_ITEMS = 10;

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // 初始状态
      selectedTreeId: null,
      isCollapsed: false,
      width: DEFAULT_WIDTH,
      searchQuery: "",
      searchResults: [],
      isSearching: false,
      filterType: "all",
      favoriteTreeIds: [],
      recentTreeIds: [],

      // 基础动作
      setSelectedTreeId: (id) => {
        set({ selectedTreeId: id });
        // 选择时自动添加到最近访问
        if (id) {
          get().addToRecent(id);
        }
      },

      toggleCollapse: () =>
        set((state) => ({
          isCollapsed: !state.isCollapsed,
        })),

      setWidth: (width) => {
        const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
        set({ width: clampedWidth });
      },

      resetWidth: () => set({ width: DEFAULT_WIDTH }),

      // 搜索动作
      setSearchQuery: (query) => set({ searchQuery: query }),

      clearSearch: () =>
        set({
          searchQuery: "",
          searchResults: [],
          isSearching: false,
        }),

      setSearchResults: (results) => set({ searchResults: results }),

      setIsSearching: (isSearching) => set({ isSearching }),

      // 过滤动作
      setFilterType: (type) => set({ filterType: type }),

      addToFavorites: (id) =>
        set((state) => {
          if (!state.favoriteTreeIds.includes(id)) {
            return {
              favoriteTreeIds: [...state.favoriteTreeIds, id],
            };
          }
          return state;
        }),

      removeFromFavorites: (id) =>
        set((state) => ({
          favoriteTreeIds: state.favoriteTreeIds.filter((fId) => fId !== id),
        })),

      addToRecent: (id) =>
        set((state) => {
          const filtered = state.recentTreeIds.filter((rId) => rId !== id);
          const newRecent = [id, ...filtered].slice(0, MAX_RECENT_ITEMS);
          return { recentTreeIds: newRecent };
        }),

      clearRecent: () => set({ recentTreeIds: [] }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        selectedTreeId: state.selectedTreeId,
        isCollapsed: state.isCollapsed,
        width: state.width,
        filterType: state.filterType,
        favoriteTreeIds: state.favoriteTreeIds,
        recentTreeIds: state.recentTreeIds,
        // 注意：搜索状态不持久化，每次重新打开都是干净的
      }),
    },
  ),
);
```

### 阶段3：使用 Slices 模式重构（推荐）

当状态变得复杂时，建议拆分成多个 slice：

```typescript
// apps/web/lib/stores/slices/selection-slice.ts
import { StateCreator } from "zustand";

export interface SelectionSlice {
  selectedTreeId: string | null;
  setSelectedTreeId: (id: string | null) => void;
}

export const createSelectionSlice: StateCreator<
  SelectionSlice & UISlice & SearchSlice & FilterSlice,
  [],
  [],
  SelectionSlice
> = (set, get) => ({
  selectedTreeId: null,

  setSelectedTreeId: (id) => {
    set({ selectedTreeId: id });
    // 跨 slice 调用
    if (id) {
      get().addToRecent(id);
    }
  },
});
```

```typescript
// apps/web/lib/stores/slices/ui-slice.ts
import { StateCreator } from "zustand";

export interface UISlice {
  isCollapsed: boolean;
  width: number;
  toggleCollapse: () => void;
  setWidth: (width: number) => void;
  resetWidth: () => void;
}

const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;

export const createUISlice: StateCreator<
  SelectionSlice & UISlice & SearchSlice & FilterSlice,
  [],
  [],
  UISlice
> = (set) => ({
  isCollapsed: false,
  width: DEFAULT_WIDTH,

  toggleCollapse: () =>
    set((state) => ({
      isCollapsed: !state.isCollapsed,
    })),

  setWidth: (width) => {
    const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
    set({ width: clampedWidth });
  },

  resetWidth: () => set({ width: DEFAULT_WIDTH }),
});
```

```typescript
// apps/web/lib/stores/slices/search-slice.ts
import { StateCreator } from "zustand";

export interface SearchSlice {
  searchQuery: string;
  searchResults: string[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  setSearchResults: (results: string[]) => void;
  setIsSearching: (isSearching: boolean) => void;
}

export const createSearchSlice: StateCreator<
  SelectionSlice & UISlice & SearchSlice & FilterSlice,
  [],
  [],
  SearchSlice
> = (set) => ({
  searchQuery: "",
  searchResults: [],
  isSearching: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  clearSearch: () =>
    set({
      searchQuery: "",
      searchResults: [],
      isSearching: false,
    }),

  setSearchResults: (results) => set({ searchResults: results }),

  setIsSearching: (isSearching) => set({ isSearching }),
});
```

```typescript
// apps/web/lib/stores/slices/filter-slice.ts
import { StateCreator } from "zustand";

export interface FilterSlice {
  filterType: "all" | "favorites" | "recent";
  favoriteTreeIds: string[];
  recentTreeIds: string[];
  setFilterType: (type: "all" | "favorites" | "recent") => void;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  addToRecent: (id: string) => void;
  clearRecent: () => void;
}

const MAX_RECENT_ITEMS = 10;

export const createFilterSlice: StateCreator<
  SelectionSlice & UISlice & SearchSlice & FilterSlice,
  [],
  [],
  FilterSlice
> = (set) => ({
  filterType: "all",
  favoriteTreeIds: [],
  recentTreeIds: [],

  setFilterType: (type) => set({ filterType: type }),

  addToFavorites: (id) =>
    set((state) => {
      if (!state.favoriteTreeIds.includes(id)) {
        return {
          favoriteTreeIds: [...state.favoriteTreeIds, id],
        };
      }
      return state;
    }),

  removeFromFavorites: (id) =>
    set((state) => ({
      favoriteTreeIds: state.favoriteTreeIds.filter((fId) => fId !== id),
    })),

  addToRecent: (id) =>
    set((state) => {
      const filtered = state.recentTreeIds.filter((rId) => rId !== id);
      const newRecent = [id, ...filtered].slice(0, MAX_RECENT_ITEMS);
      return { recentTreeIds: newRecent };
    }),

  clearRecent: () => set({ recentTreeIds: [] }),
});
```

```typescript
// apps/web/lib/stores/sidebar-store.ts (重构版)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectionSlice, SelectionSlice } from "./slices/selection-slice";
import { createUISlice, UISlice } from "./slices/ui-slice";
import { createSearchSlice, SearchSlice } from "./slices/search-slice";
import { createFilterSlice, FilterSlice } from "./slices/filter-slice";

type SidebarState = SelectionSlice & UISlice & SearchSlice & FilterSlice;

export const useSidebarStore = create<SidebarState>()(
  persist(
    (...a) => ({
      ...createSelectionSlice(...a),
      ...createUISlice(...a),
      ...createSearchSlice(...a),
      ...createFilterSlice(...a),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        // 选择状态
        selectedTreeId: state.selectedTreeId,
        // UI 状态
        isCollapsed: state.isCollapsed,
        width: state.width,
        // 过滤状态
        filterType: state.filterType,
        favoriteTreeIds: state.favoriteTreeIds,
        recentTreeIds: state.recentTreeIds,
        // 搜索状态不持久化
      }),
    },
  ),
);
```

## 在组件中使用

```typescript
// components/Sidebar.tsx
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { shallow } from 'zustand/shallow';

function Sidebar() {
  // 选择性订阅，避免不必要的重新渲染
  const { isCollapsed, width, searchQuery, filterType } = useSidebarStore(
    (state) => ({
      isCollapsed: state.isCollapsed,
      width: state.width,
      searchQuery: state.searchQuery,
      filterType: state.filterType,
    }),
    shallow
  );

  // 获取动作
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse);
  const setSearchQuery = useSidebarStore((state) => state.setSearchQuery);
  const setFilterType = useSidebarStore((state) => state.setFilterType);

  return (
    <div
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{ width: isCollapsed ? 60 : width }}
    >
      <div className="sidebar-header">
        <button onClick={toggleCollapse}>
          {isCollapsed ? '→' : '←'}
        </button>

        {!isCollapsed && (
          <>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索树..."
              className="search-input"
            />

            <div className="filter-tabs">
              <button
                className={filterType === 'all' ? 'active' : ''}
                onClick={() => setFilterType('all')}
              >
                全部
              </button>
              <button
                className={filterType === 'favorites' ? 'active' : ''}
                onClick={() => setFilterType('favorites')}
              >
                收藏
              </button>
              <button
                className={filterType === 'recent' ? 'active' : ''}
                onClick={() => setFilterType('recent')}
              >
                最近
              </button>
            </div>
          </>
        )}
      </div>

      <div className="sidebar-content">
        <TreeList />
      </div>
    </div>
  );
}
```

## 总结

从你当前简单的 `sidebar-store.ts` 开始，可以按需渐进式扩展：

1. **阶段1**：添加基础 UI 状态（折叠、宽度）
2. **阶段2**：添加搜索和过滤功能
3. **阶段3**：使用 Slices 模式重构，提高可维护性

关键原则：

- **Keep it simple**：从简单开始，按需扩展
- **单一职责**：每个动作只做一件事
- **选择性订阅**：避免不必要的重新渲染
- **合理持久化**：只持久化用户偏好，不持久化临时状态

你的代码已经是一个很好的开始，按照这个模式扩展就行了！
