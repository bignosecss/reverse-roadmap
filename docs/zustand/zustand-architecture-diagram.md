# Zustand 架构图解

## 1. 状态管理概念图

```mermaid
graph TB
    subgraph "传统 React 状态传递"
        A[App 组件] --> B[Header 组件]
        A --> C[Sidebar 组件]
        A --> D[Main 组件]
        C --> E[TreeList 组件]
        D --> F[Content 组件]

        A -."props drilling".-> E
        A -."props drilling".-> F
    end

    subgraph "Zustand 状态管理"
        G[Zustand Store]
        H[Header 组件] --> G
        I[Sidebar 组件] --> G
        J[Main 组件] --> G
        K[TreeList 组件] --> G
        L[Content 组件] --> G

        G --> H
        G --> I
        G --> J
        G --> K
        G --> L
    end

    style G fill:#e1f5fe
    style A fill:#ffebee
```

## 2. Zustand Store 生命周期

```mermaid
sequenceDiagram
    participant C as 组件
    participant S as Zustand Store
    participant P as Persist 中间件
    participant LS as LocalStorage

    Note over S,LS: 应用启动
    S->>P: 初始化 Store
    P->>LS: 读取持久化数据
    LS-->>P: 返回保存的状态
    P-->>S: 恢复状态

    Note over C,S: 组件使用
    C->>S: 订阅状态 (useStore)
    S-->>C: 返回当前状态

    Note over C,S: 状态更新
    C->>S: 调用动作 (setSelectedTreeId)
    S->>S: 更新内部状态
    S->>P: 触发持久化
    P->>LS: 保存到 localStorage
    S-->>C: 通知状态变化
    C->>C: 重新渲染
```

## 3. 你的 sidebar-store 结构

```mermaid
classDiagram
    class SidebarState {
        +selectedTreeId: string | null
        +setSelectedTreeId(id: string | null): void
    }

    class PersistMiddleware {
        +name: "sidebar-storage"
        +partialize(): object
    }

    class LocalStorage {
        +getItem(key: string): string
        +setItem(key: string, value: string): void
    }

    SidebarState --> PersistMiddleware : 使用
    PersistMiddleware --> LocalStorage : 持久化到

    note for SidebarState "当前只有一个状态\n和一个动作"
    note for PersistMiddleware "只持久化 selectedTreeId\n提升性能"
```

## 4. 扩展后的复杂 Store 结构

```mermaid
graph LR
    subgraph "Sidebar Store (扩展版)"
        subgraph "Selection Slice"
            A[selectedTreeId]
            B[setSelectedTreeId]
        end

        subgraph "UI Slice"
            C[isCollapsed]
            D[toggleCollapse]
        end

        subgraph "Search Slice"
            E[searchQuery]
            F[setSearchQuery]
            G[clearSearch]
        end

        subgraph "Favorites Slice"
            H[favoriteTreeIds]
            I[addToFavorites]
            J[removeFromFavorites]
        end
    end

    subgraph "持久化策略"
        K[localStorage]
        L[sessionStorage]
        M[不持久化]
    end

    A --> K
    C --> K
    H --> K
    E --> M

    style A fill:#c8e6c9
    style C fill:#c8e6c9
    style H fill:#c8e6c9
    style E fill:#ffcdd2
```

## 5. 组件与 Store 的交互模式

```mermaid
flowchart TD
    subgraph "组件层"
        A[Sidebar 组件]
        B[TreeList 组件]
        C[SearchBox 组件]
    end

    subgraph "Store 层"
        D[useSidebarStore]
    end

    subgraph "选择器模式"
        E["(state) => state.selectedTreeId"]
        F["(state) => state.searchQuery"]
        G["(state) => state.isCollapsed"]
    end

    A --> E
    B --> E
    C --> F
    A --> G

    E --> D
    F --> D
    G --> D

    D -."状态变化通知".-> A
    D -."状态变化通知".-> B
    D -."状态变化通知".-> C

    style D fill:#e3f2fd
    style E fill:#f3e5f5
    style F fill:#f3e5f5
    style G fill:#f3e5f5
```

## 6. 性能优化策略

```mermaid
graph TB
    subgraph "❌ 性能问题"
        A["const store = useSidebarStore()"]
        A --> B["整个 store 变化都会重新渲染"]
    end

    subgraph "✅ 选择性订阅"
        C["const id = useSidebarStore(s => s.selectedTreeId)"]
        C --> D["只有 selectedTreeId 变化才重新渲染"]
    end

    subgraph "✅ Shallow 比较"
        E["useSidebarStore(s => ({id: s.id, name: s.name}), shallow)"]
        E --> F["多个值的浅比较"]
    end

    subgraph "✅ 计算属性"
        G["const filteredTrees = useMemo(() => ...)"]
        G --> H["派生状态不存储在 store 中"]
    end

    style A fill:#ffcdd2
    style C fill:#c8e6c9
    style E fill:#c8e6c9
    style G fill:#c8e6c9
```

## 7. 中间件组合模式

```mermaid
flowchart LR
    A[create] --> B[persist]
    B --> C[devtools]
    C --> D[immer]
    D --> E[subscribeWithSelector]

    subgraph "中间件功能"
        F["persist: 持久化"]
        G["devtools: 调试工具"]
        H["immer: 不可变更新"]
        I["subscribeWithSelector: 选择性订阅"]
    end

    B -.-> F
    C -.-> G
    D -.-> H
    E -.-> I

    style F fill:#e8f5e8
    style G fill:#e3f2fd
    style H fill:#fff3e0
    style I fill:#f3e5f5
```

这些图表展示了：

1. **概念对比**：传统 props drilling vs Zustand 全局状态
2. **生命周期**：从初始化到状态更新的完整流程
3. **当前结构**：你的 sidebar-store 的简单结构
4. **扩展方案**：如何组织复杂的状态
5. **交互模式**：组件如何高效地使用 store
6. **性能优化**：避免不必要的重新渲染
7. **中间件组合**：如何叠加多个功能

通过这些可视化图表，你可以更直观地理解 Zustand 的工作原理和最佳实践。
