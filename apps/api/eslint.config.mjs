import { nestJsConfig } from '@repo/eslint-config/nest-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("eslint").Linter.Config} */
export default [
  ...nestJsConfig,
  {
    // Override parser options to properly handle monorepo TypeScript setup
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.cjs", "*.mjs", "*.ts", "*.tsx"],
        },
        tsconfigRootDir: __dirname,
      }
    }
  },
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '*.config.js',
      '*.config.mjs',
      '.next/**',
      '.nuxt/**',
      'public/dist/**',
      'nuxt_dist/**',
      '.output/**',
      '.vercel/**',
      '.netlify/**',
      'vercel.json',
      'netlify.json',
    ],
  },
];