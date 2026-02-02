# Project Overview

This is a monorepo for the "Reverse Roadmap" project, a tool designed to help users achieve their goals by breaking them down into a visual mind map. The project is built with a modern tech stack, including a Next.js frontend, a NestJS backend, and a NestJS-based RAG service. The entire project is managed as a pnpm workspace using Turborepo.

## Applications

The monorepo contains three main applications under the `apps/` directory:

- **`web`**: A Next.js 14 application that provides the main user interface for the Reverse Roadmap tool. It uses React Flow for the mind map visualization, Tiptap for rich text editing, and is styled with Tailwind CSS and shadcn/ui. State management is handled by Zustand and data fetching by React Query.
- **`api`**: A NestJS application that serves as the backend for the Reverse Roadmap. It uses Mongoose to interact with a MongoDB database and provides a RESTful API for the frontend.
- **`rag`**: A NestJS application that seems to be responsible for Retrieval-Augmented Generation (RAG) tasks. It uses LangChain and Ollama, suggesting it's used for AI-powered features within the application.

## Packages

The monorepo also contains several shared packages under the `packages/` directory:

- **`eslint-config`**: Shared ESLint configurations for the different applications.
- **`typescript-config`**: Shared TypeScript configurations.
- **`shared`**: Likely contains shared types, interfaces, or utility functions used across the different applications.
- **`ui`**: Likely contains shared UI components.

# Building and Running

The project uses `pnpm` as the package manager and `turbo` to manage the monorepo scripts.

## Key Scripts

The following scripts can be run from the root of the project:

- **`pnpm install`**: Install all dependencies for the monorepo.
- **`pnpm dev`**: Start all applications in development mode.
- **`pnpm build`**: Build all applications.
- **`pnpm lint`**: Lint all applications.
- **`pnpm format`**: Format the code with Prettier.
- **`pnpm check-types`**: Run TypeScript to check for type errors.

You can also run these scripts for individual applications by running them from the application's directory. For example, to run the web application in development mode:

```bash
cd apps/web
pnpm dev
```

## Development Conventions

- **Monorepo**: The project is structured as a monorepo, which allows for code sharing and centralized dependency management.
- **TypeScript**: All applications and packages are written in TypeScript.
- **Linting and Formatting**: The project uses ESLint and Prettier to enforce a consistent coding style.
- **Database**: The `api` application uses MongoDB as its database.
- **Environment Variables**: The `turbo.json` file lists `PORT`, `NEXT_PUBLIC_RR_API`, and `MONGODB_URI` as global environment variables. You will likely need to create a `.env` file in the root of the project to set these variables. You can use `.env.example` as a template.
