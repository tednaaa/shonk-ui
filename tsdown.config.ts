import { defineConfig } from 'tsdown';

export default defineConfig({
  platform: 'neutral',
  exports: false,
  fromVite: true,
  sourcemap: true,
  // Bundled output is one module: importing Button alone shipped all of embla-carousel.
  // Bigger package, ~29 KB gzip off the consumer's entry chunk.
  unbundle: true,
  dts: { vue: true, tsconfig: './tsconfig.lib.json', sourcemap: true },

  publint: 'ci-only',
  attw: {
    enabled: 'ci-only',
    profile: 'node16',
    level: 'error',
    ignoreRules: ['cjs-resolves-to-esm'],
  },
});
