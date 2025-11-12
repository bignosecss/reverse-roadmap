好的，非常抱歉之前的方案没能准确理解你的架构。你说得对，我过于陷入代码细节，而忽略了更高层
面的职责划分。

现在我完全明白了：

- `FlowStore`: 维护数据状态，即 currentRrNode 本身。
- `CanvasStore`: 维护UI状态，即当前哪个 tab 是被选中的 (activeContentId)。
- `CanvasTabs` 组件: 接收 currentRrNode 作为 prop，并响应用户的交互。

基于这个清晰的职责划分，这是一个宏观的、只关注思路的实现方案：

---

原地编辑功能的宏观实现思路

这个方案的核心是“关注点分离”：数据存储、UI状态和临时交互状态由不同的部分各司其职。

1. 角色与职责 (Actors & Responsibilities)

1. `FlowStore` (数据中心)
   - 职责: 唯一拥有和管理 currentRrNode 及其 content 数组。
   - 需要提供: 一个 action，例如 updateContentTabTitle(nodeId, contentId,
     newTitle)。这个 action
     的任务是接收指令，找到对应的节点和内容项，然后以不可变的方式更新
     tabTitle。它不关心哪个 Tab 是激活的，只负责执行数据更新。

1. `CanvasStore` (UI状态中心)
   - 职责: 唯一拥有和管理哪个 Tab 是当前被选中的，即 activeContentId。
   - 需要提供: activeContentId 这个状态值，以及一个用于切换选中 Tab 的 action（例如
     setActiveContentId）。它不关心 Tab 的具体内容是什么，只记录哪个 ID 是当前焦点。

1. `CanvasTabs` 组件 (交互界面)
   - 职责:
     - 从 props 接收 currentRrNode 并渲染出 Tab 列表。
     - 从 CanvasStore 订阅 activeContentId 来高亮显示当前选中的 Tab。
     - 管理自身的、临时的、用于编辑的内部状态（例如 isEditing 和
       editingTitle），这部分状态不应存在于任何全局 Store 中。
     - 响应用户交互（双击、键盘输入），并在合适的时机调用 FlowStore 的 action
       来请求数据变更。

1. 交互流程 (Interaction Flow)

1. 渲染:
   - 父组件从 FlowStore 获取 currentRrNode，作为 prop 传给 CanvasTabs。
   - CanvasTabs 从 CanvasStore 获取 activeContentId。
   - CanvasTabs 遍历 currentRrNode.content 渲染所有 Tab，并根据 activeContentId
     高亮当前项。

1. 触发编辑:
   - 用户在某个 Tab 上双击。
   - CanvasTabs 的事件处理器触发，它会进行一个关键检查：“被双击的 Tab ID 是否等于来自
     `CanvasStore` 的 `activeContentId`？”
   - 如果是，CanvasTabs 就将自己内部的 isEditing 状态设为 true，进入编辑模式。
   - 如果否，则不执行任何操作。

1. 执行编辑与更新:
   - CanvasTabs 根据 isEditing 状态，将高亮的 Tab 标题渲染成一个 <input>。
   - 用户在 <input> 中输入新标题，然后按 `Enter` 键。
   - <input> 的 onKeyDown 处理器被触发。它会调用 FlowStore 提供的 updateContentTabTitle
     action，并把 currentRrNode.id、activeContentId 和输入框的新值作为参数传过去。
   - 同时，CanvasTabs 将自己内部的 isEditing 状态设回 false。

1. 数据回流与UI刷新:
   - FlowStore 的状态因为 action 的调用而更新。
   - 由于 React 的响应式机制，父组件会从 FlowStore 拿到新的 currentRrNode 对象。
   - 父组件将这个新的 currentRrNode 作为 prop 重新传递给 CanvasTabs。
   - CanvasTabs 接收到新的 props 后重新渲染，此时界面上就会显示出已经更新过的标题。

---

这个思路确保了单向数据流和清晰的职责划分，使得逻辑的追溯和未来的扩展都更加简单。
