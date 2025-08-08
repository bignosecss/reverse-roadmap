# 数据库种子系统

这个种子系统为 Reverse Roadmap 项目提供了完整的数据库初始化和测试数据生成功能。

## 🌟 功能特性

- **智能数据生成**: 自动生成结构化的学习路线图数据
- **类型安全**: 完全基于 TypeScript 和 Mongoose Schema
- **灵活配置**: 支持多种执行模式和命令行参数
- **详细日志**: 提供清晰的执行过程和结果反馈
- **生产就绪**: 经过优化的错误处理和资源管理

## 📁 文件结构

```
src/seeds/
├── README.md          # 本文档
├── seed-data.ts       # 种子数据定义
└── seed.ts           # 种子执行脚本
```

## 🚀 快速开始

### 基本用法

```bash
# 清空数据库并重新种植数据
pnpm run seed

# 不清空数据库，直接添加数据
pnpm run seed:no-clear

# 仅查看数据库统计信息
pnpm run seed:stats
```

### 执行流程

1. **连接数据库**: 使用 MongoDB Atlas 连接
2. **清空数据** (可选): 删除现有的 roots 和 trees 数据
3. **种植根节点**: 创建学习路线图的根分类
4. **构建树结构**: 生成完整的学习路径树
5. **显示统计**: 展示创建的数据概览

## 📊 数据结构

### 根节点 (RrRoots)

包含学习路线图的主要分类：

- 前端开发路线图
- 后端开发路线图
- 全栈开发路线图
- 移动端开发路线图

### 树结构 (RrTrees)

每个根节点对应一个完整的学习树：

- **前端路线图**: HTML/CSS → JavaScript → 框架 → 工程化
- **后端路线图**: 编程语言 → 数据库 → API → 部署

### 节点详情 (RrNode)

每个学习节点包含：

- `title`: 学习主题标题
- `description`: 详细描述和学习目标
- `parentId`: 父节点关联
- `children`: 子节点数组（递归结构）

## 🛠️ 自定义数据

### 添加新的根节点

在 `seed-data.ts` 中修改 `rootsSeeds` 数组：

```typescript
export const rootsSeeds: Partial<RrRoots>[] = [
  // 现有数据...
  {
    title: '你的新路线图',
    status: 'active',
  },
];
```

### 创建自定义学习树

1. 定义节点数据：

```typescript
export const yourNodes = {
  root: createNode('根节点标题', '描述'),
  child1: createNode('子节点1', '描述'),
  child2: createNode('子节点2', '描述'),
};
```

2. 构建树结构：

```typescript
export function buildYourTree(): RrNode {
  // 设置父子关系
  yourNodes.child1.parentId = yourNodes.root._id.toString();
  yourNodes.child2.parentId = yourNodes.root._id.toString();

  // 设置子节点数组
  yourNodes.root.children = [yourNodes.child1, yourNodes.child2];

  return yourNodes.root;
}
```

3. 在 `generateTreesSeeds` 函数中添加新树。

## 🔧 高级配置

### 环境变量

可以通过环境变量自定义数据库连接：

```bash
# .env 文件
MONGODB_URI=mongodb://localhost:27017/your-database
```

### 命令行参数

- `--no-clear`: 跳过数据库清空步骤
- `--stats`: 仅显示统计信息，不执行种子操作

### 编程式调用

```typescript
import { runSeed } from './seeds/seed';

// 在你的代码中调用
await runSeed();
```

## 📈 性能优化

### 批量插入

使用 `insertMany()` 进行批量操作，显著提升插入性能：

```typescript
// ✅ 推荐：批量插入
const results = await Model.insertMany(dataArray);

// ❌ 避免：逐个插入
for (const item of dataArray) {
  await Model.create(item);
}
```

### 连接池优化

种子脚本复用应用的数据库连接配置，确保最佳性能。

## 🚨 注意事项

### 生产环境

- **谨慎使用**: 默认会清空现有数据
- **备份数据**: 在生产环境执行前务必备份
- **权限控制**: 确保数据库用户有适当权限

### 开发环境

- **频繁重置**: 可以安全地多次执行
- **快速迭代**: 支持增量更新模式

## 🐛 故障排除

### 常见错误

1. **连接失败**

   ```
   ❌ 种子程序执行失败: MongoNetworkError
   ```

   - 检查网络连接
   - 验证数据库 URI
   - 确认数据库服务状态

2. **权限错误**

   ```
   ❌ 种植根节点失败: MongoServerError: not authorized
   ```

   - 检查数据库用户权限
   - 验证认证信息

3. **Schema 错误**

   ```
   ❌ ValidationError: Path `title` is required
   ```

   - 检查种子数据完整性
   - 验证 Schema 定义

### 调试模式

启用详细日志：

```typescript
// 在 seed.ts 中临时启用
const app = await NestFactory.create(SeedModule, {
  logger: ['error', 'warn', 'log'], // 启用日志
});
```

## 🔄 数据迁移

### 版本升级

当 Schema 发生变化时：

1. 备份现有数据
2. 更新种子数据结构
3. 执行迁移脚本
4. 验证数据完整性

### 增量更新

```bash
# 不清空现有数据，仅添加新内容
pnpm run seed:no-clear
```

## 📚 相关文档

- [NestJS Mongoose 文档](https://docs.nestjs.com/techniques/mongodb)
- [Mongoose Schema 指南](https://mongoosejs.com/docs/guide.html)
- [MongoDB Atlas 连接](https://docs.atlas.mongodb.com/connect-to-cluster/)

---

**💡 提示**: 这个种子系统遵循了现代 Web 开发的最佳实践，包括类型安全、错误处理和性能优化。它不仅仅是一个数据初始化工具，更是一个可扩展的数据管理解决方案。
