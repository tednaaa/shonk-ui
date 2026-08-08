/// <reference types="vitest/config" />

import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },

  plugins: [tailwindcss(), vue()],
  test: {
    globals: true,
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    open: false,

    projects: [
      {
        extends: true,
        root: import.meta.dirname,
        test: {
          include: ['src/**/*.spec.ts'],
          name: 'unit',
          environment: 'jsdom',
        },
      },
    ],
  },
});
