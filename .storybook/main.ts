import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
  },
  stories: [
    '../src/Changelog.mdx',
    '../src/**/*.stories.ts',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: {
        plugin: 'vue-component-meta',
        tsconfig: 'tsconfig.lib.json',
      },
    },
  },
};
export default config;
