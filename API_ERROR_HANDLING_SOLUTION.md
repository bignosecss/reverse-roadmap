# API错误处理解决方案

## 问题描述

当前的`apiClient`只能处理成功响应，但API可能返回两种类型的响应：

1. **成功响应**: `ApiResponse<T>` - 包含 `success`, `message`, `data` 字段
2. **错误响应**: `ApiErrorResponse` - 包含 `message`, `error`, `statusCode` 字段

## 解决方案

### 1. 更新 `client.ts` - 统一错误处理

```typescript
import type { ApiResponse, ApiErrorResponse } from "../types/apiResponses";

const BASE_URL = "http://localhost:3001/api/";
const DEFAULT_FETCH_OPTIONS: RequestInit = {};

// 自定义错误类，包含结构化的错误信息
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorResponse: ApiErrorResponse,
  ) {
    super(errorResponse.message);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...DEFAULT_FETCH_OPTIONS,
    ...options,
  });

  const responseData = await response.json();

  if (!response.ok) {
    // 如果响应不成功，抛出包含结构化错误信息的ApiError
    const errorResponse: ApiErrorResponse = {
      message: responseData.message || `HTTP ${response.status}`,
      error: responseData.error,
      statusCode: response.status,
    };
    throw new ApiError(response.status, errorResponse);
  }

  // 返回成功的ApiResponse
  return responseData as ApiResponse<T>;
}
```

### 2. 更新 `root.ts` - 正确处理响应结构

```typescript
import { apiClient, ApiError } from "./client";
import type { RrRoot } from "@/lib/types/models";

export const fetchAllRoots = async (): Promise<RrRoot[]> => {
  try {
    const result = await apiClient<RrRoot[]>("rr-root");

    console.log("fetchAllRoots result", result);

    // 检查业务逻辑是否成功
    if (!result.success) {
      throw new Error(result.message || "业务逻辑处理失败");
    }

    // 返回实际的数据部分
    return result.data;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      // 处理API错误
      console.error("API Error:", error.errorResponse);
      throw new Error(`获取根节点失败: ${error.errorResponse.message}`);
    }

    // 处理其他错误
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "网络请求失败，请检查网络连接";
    throw new Error(errorMessage);
  }
};
```

### 3. 在React组件中使用

```typescript
// 在组件中使用时，错误会被React Query自动捕获
const { data: rrRoots, isLoading, error } = useAllRoots();

// 如果需要手动处理错误
if (error) {
  console.error("获取数据失败:", error.message);
  // 显示错误提示给用户
}
```

## 核心优势

### 1. **类型安全**

- `apiClient<T>()` 返回 `Promise<ApiResponse<T>>`
- 错误信息结构化，包含状态码和详细信息

### 2. **统一错误处理**

```typescript
// HTTP错误 (4xx, 5xx) → ApiError
// 网络错误 → Error
// 业务逻辑错误 → Error
```

### 3. **简化调用**

```typescript
// 之前：需要手动检查响应结构
const response = await apiClient("rr-root");
if (response.success) {
  return response.data;
}

// 现在：直接返回数据，错误自动抛出
const data = await fetchAllRoots(); // 直接得到 RrRoot[]
```

## Linus式评价

**好品味体现**：

1. **消除特殊情况** - 不再需要在每个API调用处检查 `success` 字段
2. **数据结构优先** - `ApiResponse<T>` 和 `ApiError` 清晰定义了所有可能的响应
3. **简洁实现** - 错误处理集中在 `apiClient`，业务代码只关注数据

**实用主义**：

- 解决真实问题：API确实会返回错误
- 向后兼容：不破坏现有的API调用
- 渐进式迁移：可以逐个文件更新

这个方案让你的代码既类型安全又简洁优雅。
