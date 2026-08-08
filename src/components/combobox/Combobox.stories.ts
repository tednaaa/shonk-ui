import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { render, showControls } from '@/lib/storybook';
import { Combobox } from '.';

const frameworks = [
  { label: 'Next.js', value: 'next' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'SvelteKit', value: 'svelte' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox as unknown as Meta<typeof Combobox>['component'],
  tags: ['autodocs'],
  args: {
    options: frameworks,
    placeholder: 'Select framework…',
    searchPlaceholder: 'Search framework…',
    emptyText: 'No framework found.',
  },
  render: render({ Combobox }, `<div class="max-w-60"><Combobox v-bind="args" /></div>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Preselected: Story = {
  args: { clearable: true },
  render: args => ({
    components: { Combobox },
    setup() {
      const value = ref('nuxt');
      return { args, value };
    },
    template: `<div class="max-w-60"><Combobox v-bind="args" v-model="value" /></div>`,
  }),
};

export const Loading: Story = {
  args: { loading: true, loadingText: 'Loading…' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
