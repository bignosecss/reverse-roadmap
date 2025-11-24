# RAG 系统分析与规划

## 1. RAG 业界种类与用途分析

Retrieval-Augmented Generation (RAG) 是一种将信息检索（Retrieval）与文本生成（Generation）相结合的技术范式。其核心思想是在生成答案之前，先从一个大规模的知识库中检索出相关的文档片段，然后将这些片段作为上下文（Context）连同原始问题（Query）一起提供给大型语言模型（LLM），从而生成更准确、更具事实性的回答。

根据应用规模和复杂度的不同，RAG系统可以大致分为以下几个层级：

### 1.1 个人开发者 / 小型项目

- **场景**：个人知识库问答、文档查询、代码辅助、快速原型验证。例如，为自己的笔记、博客文章、或项目文档创建一个智能问答机器人。
- **特点**:
    - **轻量级**：通常在本地环境运行，依赖较少的外部服务。
    - **快速实现**：借助 `LangChain`、`LlamaIndex` 等框架，几行到几十行代码即可搭建一个基础的RAG流程。
    - **数据量小**：知识库通常是几十到几百个文档。
    - **成本低**：可以使用本地的向量数据库（如 `ChromaDB`, `FAISS`）和开源的嵌入模型（Embedding Models）来最小化成本。
- **技术栈示例**:
    - **编排框架**: LangChain.js / LlamaIndex.TS (或Python版)
    - **向量数据库**: ChromaDB (本地), FAISS (文件存储)
    - **嵌入模型**: `all-MiniLM-L6-v2` (开源, 本地运行) 或 OpenAI `text-embedding-ada-002` (API)
    - **LLM**: OpenAI `gpt-3.5-turbo` / `gpt-4` (API), 或本地运行的 `Ollama` + `Llama3`

### 1.2 中小企业 / 团队级应用

- **场景**：企业内部知识库（如Confluence、Notion）、产品文档问答、初级客服机器人、代码库智能查询。
- **特点**:
    - **数据量中等**：知识库可能包含数千到数万个文档，需要更高效的管理和索引。
    - **需要持久化和共享**：向量数据库需要作为独立服务部署，供团队成员或不同应用共享。
    - **对准确性和稳定性有要求**：开始关注检索质量、文档分块（Chunking）策略、元数据过滤（Metadata Filtering）等高级功能。
    - **可观察性**：需要日志和监控来追踪查询效果和系统性能。
- **技术栈示例**:
    - **编排框架**: LangChain.js / LlamaIndex.TS
    - **向量数据库**: Weaviate, Qdrant, Pinecone (SaaS) 等，作为独立的Docker容器或云服务部署。
    - **嵌入模型**: OpenAI `text-embedding-3-small/large` 或其他高性能的商业/开源模型。
    - **LLM**: OpenAI, Anthropic, Google Gemini等主流厂商的API。
    - **部署**: 通常将RAG流程封装成一个独立的Web服务（如Express.js, NestJS, FastAPI）。

### 1.3 企业级大规模应用

- **场景**：面向数百万用户的智能产品功能（如Notion AI Q&A）、金融/法律/医疗等专业领域的智能分析助手、企业级搜索引擎、复杂的客户支持系统。
- **特点**:
    - **数据量巨大且动态**：知识库可能是海量的、实时更新的文档流。
    - **混合检索（Hybrid Search）**: 结合传统的关键字检索（如BM25）和向量检索，提高在不同类型查询下的召回率。
    - **高级检索策略**: 实现重排（Re-ranking）模型，对初步检索出的文档进行二次排序，选出与问题最相关的片段。
    - **查询转换（Query Transformation）**: 对用户的复杂问题进行分解或改写，以更好地匹配知识库。
    - **安全与合规**: 严格的数据权限控制、隐私保护和审计功能。
    - **评估与迭代**: 建立完善的评估框架（RAGAs, ARES等）来量化检索和生成的效果，并持续优化。
- **技术栈示例**:
    - **索引/检索**: 自研或基于 `Elasticsearch` / `OpenSearch` 构建的混合检索系统，或使用 `Weaviate`, `Qdrant` 的高级功能。
    - **数据流水线 (Data Pipeline)**: 使用 `Airflow`, `Kafka` 等工具构建健壮的ETL流程，用于文档的实时处理和索引。
    - **重排模型**: `Cohere Rerank` 或自训练的Cross-encoder模型。
    - **LLM**: 可能是经过微调（Fine-tuning）的领域专用模型，或顶级的通用模型。
    - **部署**: 以高可用、可伸缩的微服务集群形式部署，并有完整的CI/CD和监控告警体系。

---

## 2. 针对您项目的RAG系统规划

结合您“将Flow树内容导出为知识库，并提供前端交互”的需求，这属于**团队级应用**的范畴。从零开始构建所有组件（特别是向量存储和检索算法）是极其复杂且不必要的。因此，我建议基于现有优秀的开源框架来搭建，并将其设计成一个独立的服务。

### 2.1 核心决策

#### 1. 从零构建 vs. 使用开源框架？

**结论：强烈建议使用开源框架。**

- **理由**：
    1. **避免重复造轮子**：RAG的核心流程，如文档加载、分块、嵌入、存储、检索、生成等，`LangChain.js` 和 `LlamaIndex.TS` 等框架已经提供了成熟且高度可定制的抽象。
    2. **专注业务逻辑**：使用框架能让您更专注于如何更好地处理Flow树的`content`和结构，而不是纠结于如何实现向量检索算法。
    3. **社区支持**：这些框架有庞大的社区和丰富的文档，遇到问题时更容易找到解决方案。
    4. **技术栈统一**：既然您倾向于TS，`LangChain.js` 和 `LlamaIndex.TS` 能让您在统一的TypeScript/Node.js环境中完成所有工作。

**推荐框架：`LangChain.js` 或 `LlamaIndex.TS`。** 两者功能相似，`LlamaIndex` 在索引和检索策略上可能提供更细致的控制，而 `LangChain` 的生态系统和集成范围更广。对于您的场景，两者都是优秀的选择。

#### 2. 作为后端模块 vs. 独立项目？

**结论：建议作为独立的微服务项目（例如 `apps/rag`）。**

- **理由**：
    1. **关注点分离 (Separation of Concerns)**：主后端 `apps/api` 负责核心业务逻辑（如用户、Flow树的CRUD），而 `apps/rag` 专门负责计算密集型和AI相关的任务（如嵌入、LLM调用）。这使得两个服务的职责更清晰。
    2. **独立伸缩 (Independent Scaling)**：RAG服务（特别是索引和模型推理）可能是资源密集型的。将其作为独立服务，未来可以根据负载情况独立地进行扩缩容，而不会影响主API的性能。
    3. **技术栈隔离**：RAG服务可能需要一些特殊的Python依赖（如某些嵌入模型库）或大量的内存。独立部署可以避免与主API的环境冲突。
    4. **符合Monorepo理念**：在 `apps/` 目录下创建一个新的应用 `rag` 非常符合您项目当前的 `pnpm workspace` + `turbo` 的 monorepo 结构，便于统一管理和构建。

### 2.2 架构设计建议

```mermaid
graph TD
    A[apps/web (前端)] -->|"1. 用户在节点上提问"| B[apps/api (主后端)];
    B -->|"2. 触发RAG查询"| C[apps/rag (RAG服务)];
    C -->|"3. Query Embedding"| M(Embedding Model);
    C -->|"4. 向量检索"| D[向量数据库 (Vector DB)];
    D -->|"5. 返回相关文档"| C;
    C -->|"6. 构建Prompt"| L(LLM);
    L -->|"7. 返回答案"| C;
    C -->|"8. 将答案流式返回"| B;
    B -->|"9. 将答案流式返回"| A;

    subgraph 知识库构建流程
        B_export[apps/api] -->|"a. 导出Markdown"| F[文件系统/对象存储];
        C_index[apps/rag] -->|"b. 读取文件"| F;
        C_index -->|"c. 分块, Embedding"| M;
        C_index -->|"d. 存入DB"| D;
    end

    style C fill:#f9f,stroke:#333,stroke-width:2px
```

- **`apps/web` (前端)**: 负责提供用户界面，让用户可以在特定节点上发起提问。通过HTTP请求将问题发送到 `apps/api`。
- **`apps/api` (主后端)**:
    - 增加一个接口（如 `POST /rr-node/{id}/ask`），接收前端的提问，并作为代理将请求转发给 `apps/rag` 服务。
    - 负责实现Flow树的导出逻辑。可以是一个接口，触发后将整个树的结构和所有节点的 `content` 导出为一系列 `.md` 文件。
- **`apps/rag` (新服务)**: RAG的核心。
    - 提供一个 `POST /query` 接口，接收问题，执行完整的RAG流程（嵌入问题 -> 检索文档 -> 调用LLM生成 -> 返回答案）。
    - 提供一个 `POST /index` 接口，用于触发知识库的索引过程。它会读取导出的Markdown文件，进行分块、向量化，并存入向量数据库。
- **向量数据库 (Vector Database)**:
    - **开发阶段**：推荐使用 `ChromaDB` 或 `Weaviate` 的Docker镜像，在本地快速启动。
    - **生产阶段**：可以继续使用自托管的 `Weaviate`/`Qdrant`，或迁移到云服务 `Pinecone`。

### 2.3 实施步骤建议

1.  **步骤一：环境搭建**
    - 在 `apps/` 目录下初始化一个新的 `NestJS` (或 `Express`) 项目，命名为 `rag`。
    - 配置 `pnpm-workspace.yaml` 和 `turbo.json` 以包含这个新应用。
    - 使用 Docker Compose 在项目中配置一个向量数据库服务（如 `weaviate`）。

2.  **步骤二：知识库导出功能 (在 `apps/api` 中)**
    - 创建一个服务，该服务可以遍历Flow树。
    - 对于每个节点，将其 `content` 保存为一个独立的Markdown文件，文件名可以是节点的ID (`{node-id}.md`)。
    - 可以额外创建一个索引文件（如 `index.md`），用Markdown列表描述整个树的结构和节点关系，这有助于LLM理解全局上下文。
    - 将这些文件保存到一个共享的卷或对象存储中，以便 `apps/rag` 服务可以访问。

3.  **步骤三：Indexing Pipeline (在 `apps/rag` 中)**
    - 安装 `langchain` 或 `llamaindex` 的JS/TS版本。
    - 创建 `/index` 接口。
    - 在接口逻辑中，使用框架的 `DirectoryLoader` 加载导出的Markdown文件。
    - 使用 `RecursiveCharacterTextSplitter` 对文档进行分块。
    - 使用 `OpenAIEmbeddings` 或其他嵌入模型对文本块进行向量化。
    - 使用对应的 `VectorStore`（如 `WeaviateStore`）将向量和文本内容存入数据库。

4.  **步骤四：Retrieval & Generation Pipeline (在 `apps/rag` 中)**
    - 创建 `/query` 接口。
    - 在接口逻辑中，接收用户问题。
    - 将问题向量化，并从向量数据库中检索最相关的K个文档块。
    - 构建一个包含上下文和问题的Prompt。
    - 调用LLM（如 `ChatOpenAI`），并以流式（Streaming）的方式获取响应。
    - 将响应流直接透传回调用方 (`apps/api`)。

5.  **步骤五：前后端集成**
    - 在 `apps/api` 中实现对 `apps/rag` 服务的调用。
    - 在 `apps/web` 的前端组件中，当用户提问时，调用 `apps/api` 的接口，并处理返回的流式数据，实时展现在UI上。

通过这种方式，您可以构建一个架构清晰、可扩展、技术栈统一的RAG系统，完美契合您当前的项目结构和需求。
