# `@repo/eslint-config`

Collection of internal ESLint configurations for the monorepo.

## Available Configurations

### Base Configuration

```javascript
import { config } from "@repo/eslint-config/base";
```

Shared base configuration with TypeScript, Prettier, and Turbo plugin support.

### Next.js Configuration

```javascript
import { nextJsConfig } from "@repo/eslint-config/next-js";
```

Optimized for Next.js applications with React, React Hooks, and Next.js specific rules.

### NestJS Configuration

```javascript
import { nestJsConfig } from "@repo/eslint-config/nestjs";
```

Tailored for NestJS backend applications with Node.js globals, Jest support, and strict TypeScript checking.

### React Internal Configuration

```javascript
import { reactInternalConfig } from "@repo/eslint-config/react-internal";
```

For internal React components and libraries.

## Usage

In your `eslint.config.js` or `eslint.config.mjs`:

```javascript
import { nestJsConfig } from "@repo/eslint-config/nestjs";
import tseslint from "typescript-eslint";

export default tseslint.config(...nestJsConfig, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```
