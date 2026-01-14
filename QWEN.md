# Reverse Roadmap Project - Development Context

## Project Overview

The Reverse Roadmap project is a sophisticated goal management platform that transforms traditional linear roadmaps into visual mind maps. It enables users to break down complex goals into manageable tasks while providing rich content editing capabilities similar to Notion. The project follows a modern monorepo architecture using pnpm and Turborepo.

### Architecture & Technology Stack

**Frontend (Web App)**:
- Next.js 15 with React 19
- TailwindCSS for styling with shadcn/ui components
- React Flow for mind map visualization
- Tiptap for rich text editing
- Zustand for state management
- React Query for data fetching

**Backend Services**:
- **API Service**: NestJS with MongoDB/Mongoose for core application data
- **RAG Service**: NestJS with PostgreSQL/pgvector and LangChain for AI-powered features
- Support for Ollama for local LLM integration

**Shared Components**:
- Shared utilities, DTOs, models, and flow types
- Reusable UI components
- Common TypeScript and ESLint configurations

## Project Structure

```
reverse-roadmap/
├── apps/
│   ├── web/          # Next.js frontend application
│   ├── api/          # NestJS backend API
│   └── rag/          # NestJS RAG (Retrieval Augmented Generation) service
├── packages/
│   ├── shared/       # Shared types, DTOs, and utilities
│   ├── ui/           # Shared UI components
│   ├── eslint-config # Shared ESLint configuration
│   └── typescript-config # Shared TypeScript configuration
├── docker/           # Docker configuration files
├── scripts/          # Utility scripts
├── package.json      # Root package managing the monorepo
└── docker-compose.yml # Multi-service Docker orchestration
```

## Building and Running

### Prerequisites
- Node.js >= 20
- pnpm
- Docker and Docker Compose (for full-stack setup)

### Development Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Run Full Development Stack**:
   ```bash
   # Using Docker Compose (recommended for full stack)
   docker-compose up
   
   # Or using Turborepo (requires manual database setup)
   pnpm dev
   ```

3. **Individual Services**:
   ```bash
   # Frontend only
   cd apps/web && pnpm dev
   
   # Backend API only
   cd apps/api && pnpm dev
   
   # RAG service only
   cd apps/rag && pnpm dev
   ```

### Production Builds

```bash
# Build all services
pnpm build

# Build individual services
cd apps/web && pnpm build
cd apps/api && pnpm build
cd apps/rag && pnpm build
```

## Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env

# Then fill in the required values
```

Key environment variables:
- `MONGODB_URI`: MongoDB connection string
- `DATABASE_URL`: PostgreSQL connection string for RAG service
- `NEXT_PUBLIC_RR_API`: API endpoint for frontend
- `DEEPSEEK_API_KEY`: API key for DeepSeek integration

## Database Setup

The project uses multiple databases:
- **MongoDB**: For core application data (goals, nodes, user data)
- **PostgreSQL with pgvector**: For vector storage in the RAG service
- **Ollama**: For local LLM inference

Docker Compose handles database initialization automatically with:
- `init-mongo.js` for MongoDB setup
- `init.sql` for PostgreSQL/pgvector setup

## Development Conventions

### Code Quality
- TypeScript is used throughout the project
- ESLint enforces code quality standards
- Prettier ensures consistent formatting
- Type checking is performed via `pnpm check-types`

### Testing
- Jest is configured for unit and E2E testing
- Test files follow the `*.spec.ts` naming convention
- Run tests with `pnpm test` in respective service directories

### Component Architecture
- Shared components are located in the `packages/ui` directory
- Shared types and utilities are in `packages/shared`
- Cross-service communication uses well-defined DTOs

### Feature Highlights
- Mind map visualization for goal decomposition
- Rich text editing with Tiptap integration
- Recursive page embedding for complex content
- AI-powered features via the RAG service
- Markdown import functionality for easy content migration

## Docker Orchestration

The `docker-compose.yml` file defines a complete development environment with:
- MongoDB service with automatic initialization
- API service connected to MongoDB
- PostgreSQL with pgvector for RAG service
- RAG service with LangChain integration
- Ollama service for local LLM access
- Next.js frontend with hot reloading

## Key Features

1. **Visual Goal Management**: Transform complex goals into visual mind maps
2. **Rich Content Editing**: Each node supports detailed content with Tiptap editor
3. **AI Integration**: RAG service provides intelligent features
4. **Markdown Import**: Convert existing markdown documents into roadmap nodes
5. **Progress Tracking**: Visual indicators for goal completion
6. **Modular Architecture**: Clean separation of concerns with reusable components

## Troubleshooting

- If experiencing dependency issues: `pnpm run reinstall`
- For type errors: `pnpm check-types`
- For linting issues: `pnpm lint`
- For Docker-related problems: Check that all required ports (3000, 3001, 3002, 27017, 5434, 11434) are available