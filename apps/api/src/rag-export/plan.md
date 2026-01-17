RagExportService 整体架构设计

基于你提供的需求和现有代码结构，我设计了以下架构：

┌─────────────────────────────────────────────────────────────────────────┐
│ RagExportService │
│ (Main Orchestration) │
└─────────────────────────────────────────────────────────────────────────┘
│
┌───────────────┼───────────────┐
▼ ▼ ▼
┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Data Fetcher │ │ Transformer │ │ RAG API Client │
│ │ │ │ │ │
│ • fetchRootData() │ │ • transform... │ │ • upload...() │
│ • fetchAllNodes() │ │ • convert...() │ │ │
│ • fetchAllContent() │ │ │ │ │
└─────────────────────┘ └─────────────────┘ └─────────────────┘
│
┌───────────────┼───────────────┐
▼ ▼ ▼
┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ TipTapConverter │ │ HierarchyMapper │ │ StatusCounter │
│ │ │ │ │ │
│ • toMarkdown() │ │ • buildTree() │ │ • count...() │
│ • extractTags() │ │ • getPath() │ │ │
│ • getContentType() │ │ │ │ │
└─────────────────────┘ └─────────────────┘ └─────────────────┘

1. 核心组件设计

RagExportService (主服务 - 已存在)

位置: apps/api/src/rag-export/rag-export.service.ts

职责: 编排整个导出流程
async exportToRag(rootId: string) {
// 1. 获取数据
// 2. 转换文档
// 3. 上传到 RAG API
}

---

RagDataFetcher (数据获取器)

位置: apps/api/src/rag-export/rag-data.fetcher.ts

职责: 从数据库获取原始数据
┌─────────────────────────────┬──────────────┬─────────────────────┐
│ 方法 │ 输入 │ 输出 │
├─────────────────────────────┼──────────────┼─────────────────────┤
│ fetchRootData(rootId) │ rootId │ RrRoot + rootRrNode │
├─────────────────────────────┼──────────────┼─────────────────────┤
│ fetchAllNodes(rootRrNodeId) │ rootRrNodeId │ RrNode[] (扁平数组) │
├─────────────────────────────┼──────────────┼─────────────────────┤
│ fetchAllContent(contentIds) │ string[] │ RrContent[] │
└─────────────────────────────┴──────────────┴─────────────────────┘
依赖: RrRootService, RrNodeService, RrContentService

---

RagDocumentTransformer (文档转换器)

位置: apps/api/src/rag-export/rag-document.transformer.ts

职责: 将原始数据转换为 RAG 文档格式
方法: transformToRootDocument()
输入: Root + Nodes
输出: RrRootDocument
────────────────────────────────────────
方法: transformToNodeDocument()
输入: Node + HierarchyContext
输出: RrNodeDocument
────────────────────────────────────────
方法: transformToContentDocument()
输入: Content + NodeContext
输出: RrContentDocument
依赖: HierarchyMapper, StatusCounter, TipTapConverter

---

HierarchyMapper (层级映射器)

位置: apps/api/src/rag-export/hierarchy.mapper.ts

职责: 构建节点层级结构和路径
┌───────────────────────────┬──────────┬────────────────────────────┐
│ 方法 │ 输入 │ 输出 │
├───────────────────────────┼──────────┼────────────────────────────┤
│ buildHierarchy(flatNodes) │ RrNode[] │ Map<nodeId, Node> (树结构) │
├───────────────────────────┼──────────┼────────────────────────────┤
│ buildPath(nodeId) │ nodeId │ string[] (层级路径) │
├───────────────────────────┼──────────┼────────────────────────────┤
│ getParentTitle(nodeId) │ nodeId │ string | null │
├───────────────────────────┼──────────┼────────────────────────────┤
│ getChildrenTitles(nodeId) │ nodeId │ string[] │
└───────────────────────────┴──────────┴────────────────────────────┘

---

StatusCounter (状态计数器)

位置: apps/api/src/rag-export/status.counter.ts

职责: 统计各状态节点数量
┌──────────────────────┬──────────┬──────────────┐
│ 方法 │ 输入 │ 输出 │
├──────────────────────┼──────────┼──────────────┤
│ countByStatus(nodes) │ RrNode[] │ StatusCounts │
└──────────────────────┴──────────┴──────────────┘
interface StatusCounts {
completed: number;
deprecated: number;
inProgress: number;
notStarted: number;
blocked: number;
review: number;
cancelled: number;
active: number;
}

---

TipTapConverter (TipTap 转换器)

位置: apps/api/src/rag-export/tiptap.converter.ts

职责: 将 TipTap JSON 转换为 Markdown 并提取语义信息
方法: toMarkdown(tiptapContent)
输入: any[] (TipTap JSON)
输出: string (Markdown)
────────────────────────────────────────
方法: extractTags(tiptapContent)
输入: any[]
输出: string[]
────────────────────────────────────────
方法: getContentType(tiptapContent)
输入: any[]
输出: "goal" | "task" | "note" | "code"

---

RagApiClient (RAG API 客户端)

位置: apps/api/src/rag-export/rag-api.client.ts

职责: 处理与 RAG API 的通信
┌─────────────────────────┬───────────────┬──────────────┐
│ 方法 │ 输入 │ 输出 │
├─────────────────────────┼───────────────┼──────────────┤
│ uploadDocuments(docs) │ RagDocument[] │ UploadResult │
├─────────────────────────┼───────────────┼──────────────┤
│ deleteDocuments(rootId) │ rootId │ void │
└─────────────────────────┴───────────────┴──────────────┘

---

2. 数据流程图

┌─────────┐
│ rootId │
└────┬────┘
│
▼
┌─────────────────────────────────────┐
│ 1. Data Fetcher │
│ ┌─────────────────────────────┐ │
│ │ fetchRootData(rootId) │ │
│ │ → RrRoot + rootRrNode │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ fetchAllNodes(rootRrNodeId) │ │
│ │ → RrNode[] (扁平数组) │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ fetchAllContent(contentIds) │ │
│ │ → RrContent[] │ │
│ └─────────────────────────────┘ │
└────────────┬────────────────────────┘
│
▼
┌─────────────────────────────────────┐
│ 2. Preprocessing │
│ ┌─────────────────────────────┐ │
│ │ HierarchyMapper │ │
│ │ → 构建树结构 + 路径映射 │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ StatusCounter │ │
│ │ → 统计各状态节点数量 │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ContentIndexer │ │
│ │ → 建立 nodeId → content[] │ │
│ └─────────────────────────────┘ │
└────────────┬────────────────────────┘
│
▼
┌─────────────────────────────────────┐
│ 3. Document Transformation │
│ ┌─────────────────────────────┐ │
│ │ Root Doc: │ │
│ │ • 根节点信息 │ │
│ │ • 进度统计 │ │
│ │ • 时间信息 │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Node Docs: │ │
│ │ • 层级路径 │ │
│ │ • 父子关系 │ │
│ │ • Tab 列表 │ │
│ │ • 语义标签 │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Content Docs: │ │
│ │ • TipTap → Markdown │ │
│ │ • 提取标签 │ │
│ │ • 内容统计 │ │
│ └─────────────────────────────┘ │
└────────────┬────────────────────────┘
│
▼
┌─────────────────────────────────────┐
│ 4. Upload to RAG API │
│ ┌─────────────────────────────┐ │
│ │ RagApiClient.upload() │ │
│ │ → POST /api/documents │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────────┘

---

3. 关键接口定义

// apps/api/src/rag-export/types/fetcher.types.ts
interface FetchedData {
root: RrRoot & { rootRrNode: RrNode };
nodes: RrNode[];
contents: RrContent[];
}

// apps/api/src/rag-export/types/context.types.ts
interface NodeContext {
hierarchy: string[];
level: number;
parentNodeTitle: string | null;
childrenTitles: string[];
}

interface ContentContext {
nodeId: string;
nodeTitle: string;
nodeStatus: string;
nodeDescription?: string;
rrRootId: string;
rrRootTitle: string;
}

// apps/api/src/rag-export/types/converter.types.ts
interface ConversionResult {
markdown: string;
tags: string[];
contentType: 'goal' | 'task' | 'note' | 'code';
contentLength: number;
}

---

4. TipTap 转换算法设计

TipTap JSON 结构示例:
{
"type": "doc",
"content": [
{ "type": "paragraph", "content": [{ "type": "text", "text": "Hello" }] },
{ "type": "heading", "attrs": { "level": 1 }, "content": [...] },
{ "type": "codeBlock", "attrs": { "language": "javascript" }, ... },
{ "type": "bulletList", ... },
{ "type": "image", "attrs": { "src": "...", "alt": "..." } }
]
}

转换策略:
┌─────────────┬─────────────────────────────────┬──────────────┐
│ TipTap 类型 │ Markdown 输出 │ 提取标签策略 │
├─────────────┼─────────────────────────────────┼──────────────┤
│ paragraph │ \n{content}\n │ 提取关键词 │
├─────────────┼─────────────────────────────────┼──────────────┤
│ heading │ {"#".repeat(level)} {content}\n │ 标题内容 │
├─────────────┼─────────────────────────────────┼──────────────┤
│ codeBlock │ \{lang}\n{code}\n` │ 语言关键字 │
├─────────────┼─────────────────────────────────┼──────────────┤
│ bulletList │ - {item} │ 列表项 │
├─────────────┼─────────────────────────────────┼──────────────┤
│ image │ ![{alt}]({src}) │ (跳过) │
├─────────────┼─────────────────────────────────┼──────────────┤
│ table │ Markdown 表格 │ 表头内容 │
└─────────────┴─────────────────────────────────┴──────────────┘
内容类型推断:

- 代码块比例 > 30% → code
- 包含 "goal/目标/终极" → goal
- 包含 "todo/task/任务" → task
- 其他 → note

---

5. 文件结构

apps/api/src/rag-export/
├── rag-export.module.ts # Module 定义
├── rag-export.service.ts # 主服务 (已存在)
├── rag-export.controller.ts # Controller (如需 API 端点)
│
├── data-fetcher/
│ └── rag-data.fetcher.ts # 数据获取
│
├── transformer/
│ └── rag-document.transformer.ts # 文档转换
│
├── utils/
│ ├── hierarchy.mapper.ts # 层级映射
│ ├── status.counter.ts # 状态计数
│ ├── tiptap.converter.ts # TipTap 转换
│ └── tag-extractor.ts # 标签提取
│
├── client/
│ └── rag-api.client.ts # RAG API 客户端
│
└── types/
├── fetcher.types.ts
├── context.types.ts
└── converter.types.ts

⏺ --- 6. 设计要点总结

1. 职责分离: 每个模块有明确的单一职责，便于测试和维护
2. 数据流清晰: Fetcher → Preprocessing → Transformation → Upload
3. 可扩展性: 转换器、映射器等工具类可独立演进
4. 性能优化: 扁平数据获取后，内存中构建层级结构，减少数据库查询
5. 错误处理: 每层独立处理异常，便于定位问题

这个架构设计可以支持你提到的所有需求：

- ✅ 通过 rootId 获取完整数据
- ✅ 转换为三种语义化文档
- ✅ TipTap JSON → Markdown 转换
- ✅ 层级路径构建、状态统计等处理算法

是否需要我继续实现某个具体组件？
