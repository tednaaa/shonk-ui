import type { Preview } from '@storybook/vue3-vite';
import './preview.css';

const preview: Preview = {
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (_story, context) => {
      const theme = context.globals.theme ?? 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      return { template: '<story />' };
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Foundations', 'Components'],
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
