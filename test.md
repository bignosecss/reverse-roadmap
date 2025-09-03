## 基于你的四层架构的目录组织方案

### 【核心判断】

✅ 值得重新组织：当前结构缺乏清晰的分层，混合了UI组件和业务逻辑

### 【关键洞察】

- **数据结构**：四层架构的核心是数据流向的单向性和职责分离
- **复杂度**：当前hooks目录只有一个UI相关hook，可以重新规划
- **风险点**：避免循环依赖，确保每层只依赖下层

### 【推荐目录结构】

```
apps/web/
├── app/                    # Next.js App Router
├── components/             # UI 组件层
│   ├── ui/                # shadcn/ui 基础组件
│   ├── business/          # 业务组件
│   │   ├── todo/
│   │   │   ├── todo-list.tsx
│   │   │   ├── todo-item.tsx
│   │   │   └── create-todo-form.tsx
│   │   └── user/
│   └── layout/            # 布局组件 (sidebar, flow等)
│       ├── sidebar/
│       └── flow/
├── hooks/                  # Hooks 层
│   ├── ui/                # UI相关hooks (保留shadcn的)
│   │   └── use-mobile.ts
│   ├── api/               # API相关hooks
│   │   ├── todo/
│   │   │   ├── use-todos.ts
│   │   │   ├── use-create-todo.ts
│   │   │   └── use-update-todo.ts
│   │   └── user/
│   │       ├── use-user.ts
│   │       └── use-auth.ts
│   └── store/             # 状态管理hooks
│       ├── use-todo-store.ts
│       └── use-ui-store.ts
├── lib/
│   ├── api/               # API 层
│   │   ├── todo.ts        # todo相关API函数
│   │   ├── user.ts        # user相关API函数
│   │   └── index.ts       # 统一导出
│   ├── client/            # Client 层
│   │   ├── http-client.ts # 基于fetch的封装
│   │   ├── query-client.ts# React Query配置
│   │   └── index.ts
│   ├── types/             # 类型定义
│   ├── utils/             # 工具函数
│   └── stores/            # Zustand stores
└── providers/             # 全局Provider
    ├── query-provider.tsx
    └── theme-provider.tsx
```

### 【核心设计原则】

1. **"好品味"的分层**：
   - 每层职责单一，UI层只管展示，Hooks层只管状态，API层只管接口
   - 消除特殊情况：统一的错误处理、统一的数据格式

2. **"Never break userspace"**：
   - 保持现有shadcn/ui组件位置不变
   - 渐进式迁移，不破坏现有功能

3. **实用主义**：
   - hooks/ui/ 保留shadcn生成的hooks
   - hooks/api/ 专门放业务相关的React Query hooks
   - lib/api/ 纯函数，易测试

### 【迁移步骤】

1. **第一步：创建新目录结构**

   ```bash
   mkdir -p hooks/{api,store}
   mkdir -p lib/{api,client}
   mkdir -p components/business
   ```

2. **第二步：移动现有文件**

   ```bash
   # 保持hooks/use-mobile.ts位置不变
   mv hooks/use-mobile.ts hooks/ui/use-mobile.ts
   ```

3. **第三步：创建Client层**

   ```typescript
   // lib/client/http-client.ts
   export const httpClient = {
     get: <T>(url: string) => fetch(url).then(r => r.json() as T),
     post: <T>(url: string, data: any) => fetch(url, {...}).then(r => r.json() as T)
   }
   ```

4. **第四步：创建API层**

   ```typescript
   // lib/api/todo.ts
   export const todoApi = {
     getTodos: () => httpClient.get<Todo[]>("/api/todos"),
     createTodo: (data: CreateTodoData) =>
       httpClient.post<Todo>("/api/todos", data),
   };
   ```

5. **第五步：创建Hooks层**
   ```typescript
   // hooks/api/todo/use-todos.ts
   export const useTodos = () =>
     useQuery({
       queryKey: ["todos"],
       queryFn: todoApi.getTodos,
     });
   ```

### 【文件命名规范】

- **API文件**：`todo.ts`, `user.ts` (名词，表示资源)
- **Hook文件**：`use-todos.ts`, `use-create-todo.ts` (动词，表示行为)
- **组件文件**：`todo-list.tsx`, `create-todo-form.tsx` (kebab-case)

这个结构确保了：

- 数据流向清晰：UI → Hooks → API → Client
- 职责分离：每层只做自己该做的事
- 易于测试：每层都是纯函数或标准React模式
- 向后兼容：不破坏现有shadcn/ui的组织方式

**"这不是在解决假想的问题，而是在建立真正可维护的代码结构。"**
