import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render, showControls } from '@/lib/storybook';
import { Combobox } from '.';
import ComboboxPreselected from './examples/ComboboxPreselected.vue';
import comboboxPreselectedSource from './examples/ComboboxPreselected.vue?raw';

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
    triggerPlaceholder: 'Select framework…',
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
  parameters: example(comboboxPreselectedSource),
  render: render({ ComboboxPreselected }, `<div class="max-w-60"><ComboboxPreselected /></div>`),
};

export const Loading: Story = {
  args: { loading: true, loadingText: 'Loading…' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
