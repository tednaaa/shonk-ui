import type { Preview } from '@storybook/vue3-vite';
import { computed, provide } from 'vue';
import { templateSource } from '@/lib/storybook';
import { en, localeInjectionKey, resolveLocale, ru } from '@/locales';
import { registerVueGrammar } from './highlighting';
import './preview.css';

registerVueGrammar();

const locales = { en, ru };

const presetItems = [
  { value: 'atlas', title: 'Atlas' },
  { value: 'graphite', title: 'Graphite' },
  { value: 'nocturne', title: 'Nocturne' },
  { value: 'orchid', title: 'Orchid' },
];

const defaultPreset = presetItems[0].value;

const preview: Preview = {
  initialGlobals: {
    theme: 'light',
    locale: 'en',
    preset: defaultPreset,
  },
  globalTypes: {
    preset: {
      description: 'Theme preset, over both light and dark',
      toolbar: {
        icon: 'paintbrush',
        items: presetItems,
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Locale for text baked into components',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'ru', title: 'Русский' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (_story, context) => {
      const theme = context.globals.theme ?? 'light';
      const preset = context.globals.preset ?? defaultPreset;
      const root = document.documentElement;

      root.classList.toggle('dark', theme === 'dark');
      delete root.dataset.theme;

      if (preset !== defaultPreset)
        root.dataset.theme = preset as string;

      return { template: '<story />' };
    },
    (_story, context) => ({
      setup() {
        provide(localeInjectionKey, computed(() => {
          const locale = context.globals.locale as keyof typeof locales;

          return resolveLocale(locales[locale] ?? en);
        }));
      },
      template: '<story />',
    }),
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Changelog', 'Foundations', 'Components', 'Mobile'],
      },
    },
    docs: {
      source: {
        language: 'vue',
        transform: templateSource,
      },
    },
    backgrounds: { disable: true },
    controls: {
      disable: true,
      disableSaveFromUI: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
