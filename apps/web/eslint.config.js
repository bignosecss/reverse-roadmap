import { nextJsConfig } from "@repo/eslint-config/next-js";
import pluginQuery from '@tanstack/eslint-plugin-query';

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'node_modules/**',
      '.env*',
      '*.log',
      'coverage/**',
      '.nyc_output/**',
      'tmp/**',
      'temp/**'
    ]
  },
  ...nextJsConfig,
  ...pluginQuery.configs['flat/recommended'],
];
