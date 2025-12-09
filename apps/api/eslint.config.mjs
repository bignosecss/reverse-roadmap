import { nestJsConfig } from '@repo/eslint-config/nest';
import tseslint from 'typescript-eslint';

export default tseslint.config(
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
);