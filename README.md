# Reverse Roadmap - 本地运行指南

---

## 前置要求

- **Node.js**: >= 20

---

## Docker 快速启动（推荐）

所有服务（MongoDB、PostgreSQL、API、RAG、Web）会自动启动。

### 1. 克隆仓库

```bash
git clone https://github.com/bignosecss/reverse-roadmap.git
cd reverse-roadmap
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 3. 启动服务

```bash
docker compose build && docker compose up -d
```

### 4. 访问应用

- **前端**: http://localhost:3000
- **API**: http://localhost:3001/api/
- **RAG**: http://localhost:3002/rag/
