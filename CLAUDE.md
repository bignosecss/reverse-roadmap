# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Reverse Roadmap** is a visual goal management application that uses a mind map interface to help users break down large goals into manageable tasks. It combines task management with knowledge management through rich text editing capabilities.

**Node.js Requirement**: Requires Node.js >= 20

## Monorepo Structure

```
apps/
  web/        # Next.js 15 frontend (React Flow + TipTap + Zustand + TanStack Query)
  api/        # NestJS REST API backend (MongoDB + Mongoose)
  rag/        # NestJS RAG/Agent service (LangChain + DeepSeek)

packages/
  shared/     # Shared TypeScript types, DTOs, and utilities
  ui/         # Reusable UI components (Radix UI + Tailwind)
  eslint-config/
  typescript-config/
```

## Development Commands

### Root Level (run from project root)

- `pnpm dev` - Start all apps in development mode (web on port 3000, api on port 3001)
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all code
- `pnpm check-types` - Type check all packages
- `pnpm format` - Format code with Prettier
- `pnpm allinone` - Full workflow: clean → reinstall → format → typecheck → lint → build
- `pnpm reinstall` - Clean all node_modules and reinstall
- `pnpm clean` - Remove .next and .turbo directories

### API Backend (apps/api)

- `pnpm dev` - Start API with watch mode (defaults to port 3001)
- `pnpm seed` - Seed database with sample data
- `pnpm seed:no-clear` - Seed without clearing existing data
- `pnpm seed:stats` - Show database statistics
- `pnpm migrate-rr-roots` - Run rr-root migration script
- `pnpm update-group-fields` - Update group fields
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:e2e` - Run e2e tests

### RAG/Agent Service (apps/rag)

- `pnpm dev` - Start RAG service with watch mode
- `pnpm test` - Run unit tests

## Core Data Model

The application revolves around three MongoDB collections:

1. **RrRoot** - Top-level goal container
   - Contains a reference to `rootRrNode` (the root node of the mind map)
   - Status: `public`/`private`

2. **RrNode** - Hierarchical nodes in the mind map
   - `parent`: Reference to parent node (null for root)
   - `children`: Array of child node references
   - `content`: Array of tabbed content (`{rrContent, tabTitle}`)
   - Status: `Active`, `InProgress`, `Completed`, `Blocked`, etc.

3. **RrContent** - Rich text content stored as TipTap JSON
   - `type`: Always "doc"
   - `content`: TipTap document JSON (from `editor.getJSON()`)

## Key Technologies & Patterns

### Frontend (apps/web)

- **React Flow**: Mind map visualization at `apps/web/components/flow/`
- **TipTap**: Rich text editor at `apps/web/components/tiptap/`
  - Extensions: Code blocks with syntax highlighting (lowlight), tables, images, slash commands
  - Auto-save via custom hook (`useAutoSave`)
- **State Management**:
  - Zustand for UI state
  - TanStack React Query for server state (API calls)
- **Styling**: TailwindCSS 4 with dark/light mode (next-themes)

### Backend (apps/api)

- **NestJS Architecture**: Module-based structure (`rr-root`, `rr-node`, `rr-content`)
- **Mongoose Schemas**: Located in `apps/api/src/{module}/schemas/`
- **Validation**: class-validator/class-transformer for DTOs

### RAG/Agent Service (apps/rag)

- **Agent System**: LangChain-based agent for generating reverse roadmaps
  - Uses DeepSeek LLM model
  - Agent tools: `generate-reverse-roadmap` (planning), `save-reverse-roadmap` (persisting)
  - System prompt defined in `apps/rag/src/utils/constants/template.constant.ts`
  - Agent can query existing nodes, identify dependencies, and create hierarchical task structures
- **LLM Integration**: DeepSeek API for agent operations
- **Vector Store**: MongoDB integration for semantic search

## Type Sharing

All types are defined in `packages/shared/src/types/` and shared across frontend and backend:

- `models/`: RrRoot, RrNode, RrContent interfaces
- `dto/`: Data transfer objects for API
- `flow/`: React Flow node and edge types

When modifying data models, update:

1. The interface in `packages/shared/src/types/models/`
2. The corresponding Mongoose schema in `apps/api/src/{module}/schemas/`

## TipTap Editor Architecture

The TipTap editor is located at `apps/web/components/tiptap/index.tsx`:

- Uses custom extensions in `apps/web/components/tiptap/extensions/`
  - `image/`: Resizable image upload with dialog
  - `slash-commands/`: Command palette for quick actions
  - `bubble-menu/`: Floating formatting menu
- Auto-save handles CJK IME composition events properly
- Content is stored as TipTap JSON (not HTML/Markdown)

## Environment Variables

Key env vars (defined in `turbo.json` as globalEnv):

- `PORT` - API server port (default: 3001)
- `NEXT_PUBLIC_RR_API` - Frontend API endpoint
- `NEXT_PUBLIC_RAG_API` - RAG/Agent service endpoint
- `MONGODB_URI` - MongoDB connection string
- `DEEPSEEK_API_KEY` - DeepSeek API key for agent functionality
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` - Basic auth credentials

## Package Manager

Uses **pnpm** (version 10.14.0) with workspaces. Always use `pnpm` commands instead of `npm`.

## Authentication

The API uses session-based authentication with express-session:

- Session secret is configured in `apps/api/src/main.ts`
- Sessions expire after 30 minutes of inactivity
- CORS is enabled for `http://localhost:3000`
- AuthGuard is applied globally at `apps/api/src/auth/auth.guard.ts`
