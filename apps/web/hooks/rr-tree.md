# React Query 缓存更新策略：性能与一致性

当使用 React Query 的 `useMutation` 修改服务端数据后，我们需要更新本地缓存以反映这些变化。针对大型或嵌套的数据结构（如本项目中的 `rrTree`），主要有两种缓存更新策略。这两种策略在实现简单性、数据一致性和UI性能之间做出了不同的权衡。

---

### 方案一：使用 `invalidateQueries` (简单可靠，保证最终一致性)

这是最直接、最安全的策略。它在 `onSettled` 回调（无论成功或失败都会执行）中将相关查询标记为“失效”，从而触发 React Query 自动重新从服务器获取最新数据。

#### 实现方式

```typescript
// 在 useMutation 的参数中
onSettled: () => {
  if (!currentTreeId) return;
  queryClient.invalidateQueries({ queryKey: ["rrTree", currentTreeId] });
},
```

#### 优点

- **简单**: 实现非常直接，只需一行代码。
- **可靠**: 能够保证客户端数据与服务端的“最终一致性”。任何在服务端发生的并发修改或副作用（如更新父节点的 `updatedAt` 时间戳）都会被正确同步到客户端。

#### 缺点

- **性能开销大**: 即使只修改了一个节点，也会导致整个树状结构被重新下载。对于大型数据集，这会产生不必要的网络流量和服务器负载。
- **可能导致UI抖动**: 重新获取数据会创建一个全新的数据对象引用，导致所有消费该数据的组件（如此处的 `flow-content.tsx`）发生重渲染，在数据量大时可能造成明显的界面卡顿或抖动。

---

### 方案二：使用 `setQueryData` 手动更新 (高性能，实现稍复杂)

此策略在 `onSuccess` 回调中，利用服务端成功响应返回的数据，“精确地”、“不可变地”更新本地缓存中的现有数据。这是处理大型嵌套数据更新时的首选高性能方案。

#### 实现方式

```typescript
// 在 useMutation 的参数中
onSuccess: (updatedNodeFromServer: RrNode) => {
  if (!currentTreeId) return;

  queryClient.setQueryData(
    ["rrTree", currentTreeId],
    (oldTreeData: RrNode | undefined) => {
      if (!oldTreeData) return undefined;

      // 递归函数，用于在树中不可变地更新一个节点
      const updateNodeInTree = (node: RrNode): RrNode => {
        // 如果找到目标节点，返回一个包含服务器最新数据的新节点对象
        if (node._id === updatedNodeFromServer._id) {
          return { ...node, ...updatedNodeFromServer };
        }

        // 如果当前节点不是目标，则递归地在其子节点中查找
        if (node.children && node.children.length > 0) {
          let hasChanged = false;
          const newChildren = node.children.map((child) => {
            const newChild = updateNodeInTree(child);
            // 通过比较引用来检查子节点是否发生了变化
            if (newChild !== child) {
              hasChanged = true;
            }
            return newChild;
          });

          // 如果子节点路径上发生了变化，则创建一个新的父节点对象，并带上新的子节点数组
          if (hasChanged) {
            return { ...node, children: newChildren };
          }
        }

        // 如果当前节点及其所有子节点都未发生变化，返回原始节点对象以保持引用
        return node;
      };

      return updateNodeInTree(oldTreeData);
    },
  );
},
```

#### 优点

- **高性能**: 无需额外的网络请求。通过保持未变动部分的引用，最大限度地减少了 React 的重渲染范围，避免了UI卡顿。
- **流畅的用户体验**: 结合乐观更新（`onMutate`），可以实现极其平滑、响应迅速的交互体验。

#### 缺点

- **实现更复杂**: 需要手动编写不可变更新的逻辑（如上面的递归函数），对于深层嵌套的数据结构，逻辑可能变得复杂。
- **可能错过副作用**: 如果服务端的更新操作包含了意料之外的副作用（例如，修改了树中另一个不相关节点的状态），这种手动更新将无法察觉，可能导致数据短暂地不一致，直到下一次自动 refetch（如窗口重新聚焦）。

### 结论

- **方案一** 是一个优秀、安全的**默认选项**，适用于非性能敏感或数据量不大的场景。
- **方案二** 是处理**性能敏感、大型、嵌套数据结构**时的理想选择。对于本项目的 `rr-tree` 来说，这是更合适的策略，可以提供最佳的用户体验。
