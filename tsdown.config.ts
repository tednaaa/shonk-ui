import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'theme-validator': 'scripts/theme-validator.ts',
    'validate-themes': 'scripts/validate-themes.ts',
  },
  platform: 'neutral',
  deps: { neverBundle: [/^node:/] },
  exports: false,
  fromVite: true,
  sourcemap: true,
  // Bundled output is one module: importing Button alone shipped all of embla-carousel.
  // Bigger package, ~29 KB gzip off the consumer's entry chunk.
  unbundle: true,
  outputOptions: { preserveModulesRoot: 'src' },
  dts: { vue: true, tsconfig: './tsconfig.lib.json', sourcemap: true },

  publint: 'ci-only',
  attw: {
    enabled: 'ci-only',
    profile: 'node16',
    level: 'error',
    ignoreRules: ['cjs-resolves-to-esm'],
  },
});
