import type { Preview } from '@storybook/vue3-vite';
import { computed, provide } from 'vue';
import { en, localeInjectionKey, resolveLocale, ru } from '@/locales';
import './preview.css';

const locales = { en, ru };

const preview: Preview = {
  initialGlobals: {
    theme: 'light',
    locale: 'en',
  },
  globalTypes: {
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
      document.documentElement.classList.toggle('dark', theme === 'dark');
      return { template: '<story />' };
    },
    (_story, context) => ({
      setup() {
        const locale = context.globals.locale as keyof typeof locales;
        provide(localeInjectionKey, computed(() => resolveLocale(locales[locale] ?? en)));
      },
      template: '<story />',
    }),
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Changelog', 'Foundations', 'Components'],
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
