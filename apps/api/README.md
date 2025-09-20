# API 模块重构计划

本次重构旨在梳理 `rr-root`、`rr-node` 和 `rr-node-content` 三个核心模块的内部逻辑和模块间依赖关系。目标是实现高度内聚、低耦合的架构，使每个模块权责清晰，代码更易于理解和维护。

## 核心原则

1.  **单一职责原则 (SRP)**:
    - **Controller**: 只负责处理 HTTP 请求、验证输入（DTOs）、调用对应的 Service 并返回响应。**严禁**包含任何业务逻辑。
    - **Service**: 负责处理核心业务逻辑、与数据库交互（通过 Mongoose Model）、调用其他模块的 Service。**严禁**直接操作其他模块的 Model。
    - **Mapper**: 负责数据结构转换，如 `Document` (Mongoose) <-> `Entity` (领域对象) <-> `DTO` (数据传输对象)。**严禁**包含业务逻辑或数据库调用。
2.  **清晰的模块边界**:
    - 模块间的通信必须通过导入对方的 `Module` 并注入其 `Service` 来实现。
    - 禁止模块 A 的 Service 直接依赖模块 B 的 Model 或 Mapper。

---

## 重构清单

### Phase 1: 分析与准备

- [ ] **审查代码现状**: 通读 `rr-root`, `rr-node`, `rr-node-content` 三个模块的 `controller`, `service`, `mapper` 文件，识别出不符合上述核心原则的代码。
  - _重点关注：Service 是否操作了不属于自己的 Model？Controller 是否包含了业务逻辑？Mapper 是否做了数据转换之外的事情？_
- [ ] **绘制当前依赖图**: 简单绘制出模块间 `Service` 的调用关系，以及 `Service` 对 `Model` 的依赖关系，明确当前的混乱点。

### Phase 2: 重构实施 (建议自下而上)

#### 1. Mapper 层重构

- [ ] **职责单一化**: 确保所有 `Mapper` 文件 (`rr-node.mapper.ts`, `rr-root.mapper.ts` 等) 只包含数据转换方法 (例如 `toEntity`, `toDto`, `fromDocument`)。
- [ ] **剥离业务逻辑**: 将任何存在于 `Mapper` 中的业务判断、计算等逻辑，迁移到对应的 `Service` 文件中。

#### 2. Service 层重构

- [ ] **业务逻辑归位**: 将所有散落在 `Controller` 或 `Mapper` 中的业务逻辑，全部整合到相应模块的 `Service` 中。
- [ ] **明确数据库操作边界**:
  - `RrNodeService` 只能注入和操作 `RrNodeModel`。
  - `RrRootService` 只能注入和操作 `RrRootModel`。
  - `RrNodeContentService` 只能注入和操作 `RrNodeContentModel`。
- [ ] **规范化服务间通信**:
  - 如果 `RrNodeService` 需要操作 `RrRoot` 的数据，它必须注入 `RrRootService` 并调用其方法，而不是直接注入 `RrRootModel`。
  - 检查并修正 `*.module.ts` 文件，确保在 `imports` 数组中正确导入了依赖的模块。

#### 3. Controller 层重构

- [ ] **简化 Controller**: 移除所有业务逻辑，让 `Controller` 的方法体变得轻薄。
- [ ] **统一入口**: 确保每个 Controller 方法只调用一个 `Service` 方法来完成其主要职责。
- [ ] **强化 DTO 验证**: 确保所有 `POST`, `PUT`, `PATCH` 请求都使用 `@Body()` 配合对应的 DTO，并充分利用 `class-validator`。

### Phase 3: 模块依赖清理

- [ ] **审查 `*.module.ts`**:
  - 检查 `providers` 数组，确保只提供了当前模块自身的 `Service` 和 `Mapper`。
  - 检查 `exports` 数组，只导出需要被其他模块使用的 `Service`。
  - 检查 `imports` 数组，明确声明模块间的依赖关系。移除不必要的导入。

### Phase 4: 验证

- [ ] **编译检查**: 运行 `pnpm build` 确保代码能够成功编译。
- [ ] **单元/集成测试**: 运行 `pnpm test` 确保所有现有测试用例都能通过。
- [ ] **(建议) 补充测试**: 为重构后的 `Service` 逻辑编写新的单元测试，以巩固重构成果。
- [ ] **端到端测试**: 通过 Postman 或其他工具，手动测试所有相关的 API 端点，确保功能与重构前一致。
