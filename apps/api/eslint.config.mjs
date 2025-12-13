import { nestJsConfig } from '@repo/eslint-config/nest-js';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nestJsConfig,
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