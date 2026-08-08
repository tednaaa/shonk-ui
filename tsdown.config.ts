import { defineConfig } from 'tsdown';

export default defineConfig({
  platform: 'neutral',
  exports: false,
  fromVite: true,
  sourcemap: true,
  dts: { vue: true, tsconfig: './tsconfig.lib.json', sourcemap: true },

  publint: 'ci-only',
  attw: {
    enabled: 'ci-only',
    profile: 'node16',
    level: 'error',
    ignoreRules: ['cjs-resolves-to-esm'],
  },
});
