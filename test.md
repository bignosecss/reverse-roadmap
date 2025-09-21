# 异步删除模式解决方案

## 问题描述

前端删除root时等待很久然后显示删除失败，但数据库实际上已成功删除。原因是删除操作耗时较长，超过了前端设置的15秒超时时间。

## 解决方案：实现异步删除模式

### 第一步：修改后端API，立即返回响应

修改 `apps/api/src/rr-root/rr-root.service.ts` 中的 `remove` 方法：

```typescript
async remove(id: string) {
  // 立即删除root记录并返回结果
  const removedRoot = await this.rrRootMapper.remove(id);

  // 异步执行关联节点的删除操作
  setImmediate(async () => {
    try {
      await this.rrNodeService.removeRootNode(
        removedRoot.treeRootNodeId.toString(),
      );
    } catch (error) {
      console.error(`Failed to remove associated root node ${removedRoot.treeRootNodeId} asynchronously:`, error);
    }
  });

  return removedRoot;
}
```

### 第二步：实现后台任务队列（可选但推荐）

为了更好地管理异步任务，可以引入任务队列系统：

```typescript
// 在 rr-root.service.ts 中添加
import { Injectable } from "@nestjs/common";
import { Queue, Worker } from "bullmq";

@Injectable()
export class AsyncDeletionService {
  private deletionQueue: Queue;

  constructor() {
    this.deletionQueue = new Queue("deletion");

    // 处理删除任务的工作进程
    const worker = new Worker("deletion", async (job) => {
      const { nodeId } = job.data;
      // 执行实际的节点删除操作
      // 这里需要注入相应的服务来执行删除
    });
  }

  async scheduleNodeDeletion(nodeId: string) {
    await this.deletionQueue.add("deleteNode", { nodeId });
  }
}
```

### 第三步：通过WebSocket或轮询通知前端删除进度

#### 方案一：使用WebSocket实现实时通知

1. 安装WebSocket相关依赖：

```bash
npm install @nestjs/websockets @nestjs/platform-ws
```

2. 创建WebSocket网关：

```typescript
// deletion.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*", // 根据实际情况设置CORS策略
  },
})
export class DeletionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  // 通知特定客户端删除进度
  notifyDeletionProgress(clientId: string, progress: number, message: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit("deletionProgress", { progress, message });
    }
  }

  // 通知特定客户端删除完成
  notifyDeletionComplete(clientId: string, success: boolean, message: string) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit("deletionComplete", { success, message });
    }
  }
}
```

3. 在删除服务中集成WebSocket通知：

```typescript
// 修改 rr-root.service.ts
async remove(id: string, clientId: string) {
  // 立即删除root记录并返回结果
  const removedRoot = await this.rrRootMapper.remove(id);

  // 通知客户端删除已启动
  this.deletionGateway.notifyDeletionProgress(clientId, 10, '开始删除关联节点...');

  // 异步执行关联节点的删除操作
  setImmediate(async () => {
    try {
      this.deletionGateway.notifyDeletionProgress(clientId, 30, '正在删除根节点...');
      await this.rrNodeService.removeRootNode(removedRoot.treeRootNodeId.toString());

      this.deletionGateway.notifyDeletionProgress(clientId, 80, '正在清理关联内容...');
      // 可以在这里添加更多清理步骤

      this.deletionGateway.notifyDeletionProgress(clientId, 100, '删除完成');
      this.deletionGateway.notifyDeletionComplete(clientId, true, '删除成功');
    } catch (error) {
      console.error(`Failed to remove associated root node ${removedRoot.treeRootNodeId} asynchronously:`, error);
      this.deletionGateway.notifyDeletionComplete(clientId, false, '删除过程中出现错误');
    }
  });

  return removedRoot;
}
```

4. 前端集成WebSocket：

```typescript
// 在前端组件中
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // 根据实际情况调整URL

const handleDelete = useCallback(async () => {
  try {
    // 发起删除请求，传入客户端ID
    await deleteRrRootAsync();

    // 监听删除进度
    socket.on("deletionProgress", (data) => {
      toast.info(`删除进度: ${data.progress}%`, {
        description: data.message,
        position: "top-center",
      });
    });

    // 监听删除完成
    socket.on("deletionComplete", (data) => {
      if (data.success) {
        toast.success("删除成功", {
          position: "top-center",
        });
      } else {
        toast.error("删除失败", {
          description: data.message,
          position: "top-center",
        });
      }
      router.push("/");
    });

    toast.success("删除已启动，正在后台处理...", {
      position: "top-center",
    });
  } catch (err: unknown) {
    toast.error("删除启动失败", {
      description: JSON.stringify(err),
    });
  }
}, [deleteRrRootAsync, router]);
```

#### 方案二：使用轮询机制

1. 后端创建删除状态查询接口：

```typescript
// 在 rr-root.controller.ts 中添加
@Get(':id/deletion-status')
async getDeletionStatus(@Param('id') id: string) {
  // 从缓存或数据库中查询删除状态
  // 这里需要实现状态存储机制
  const status = deletionStatusService.getStatus(id);
  return {
    success: true,
    data: status
  };
}
```

2. 前端实现轮询机制：

```typescript
const handleDelete = useCallback(async () => {
  try {
    // 发起删除请求
    const result = await deleteRrRootAsync();

    toast.success("删除已启动，正在后台处理...", {
      position: "top-center",
    });

    // 开始轮询删除状态
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetchDeletionStatus(result._id);
        const status = statusResponse.data;

        if (status.completed) {
          clearInterval(pollInterval);
          if (status.success) {
            toast.success("删除成功", {
              position: "top-center",
            });
          } else {
            toast.error("删除失败", {
              description: status.message,
              position: "top-center",
            });
          }
          router.push("/");
        } else {
          // 更新进度显示
          toast.info(`删除进度: ${status.progress}%`, {
            description: status.message,
            position: "top-center",
          });
        }
      } catch (pollError) {
        clearInterval(pollInterval);
        toast.error("无法获取删除状态", {
          position: "top-center",
        });
      }
    }, 2000); // 每2秒轮询一次
  } catch (err: unknown) {
    toast.error("删除启动失败", {
      description: JSON.stringify(err),
    });
  }
}, [deleteRrRootAsync, router]);
```

## 预期效果

- 用户点击删除后立即收到响应
- 删除操作在后台继续执行
- 避免前端超时问题
- 提供更好的用户体验
- 实时或准实时地向用户反馈删除进度
