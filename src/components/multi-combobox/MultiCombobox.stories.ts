import type { ComponentPropsAndSlots, Meta, StoryObj } from '@storybook/vue3-vite';
import type { FunctionalComponent } from 'vue';
import { example, render, showControls } from '@/lib/storybook';
import { MultiCombobox } from '.';
import MultiComboboxCustomFooter from './examples/MultiComboboxCustomFooter.vue';
import multiComboboxCustomFooterSource from './examples/MultiComboboxCustomFooter.vue?raw';
import MultiComboboxPinSelectedOption from './examples/MultiComboboxPinSelectedOption.vue';
import multiComboboxPinSelectedOptionSource from './examples/MultiComboboxPinSelectedOption.vue?raw';
import MultiComboboxWithCustomOptions from './examples/MultiComboboxWithCustomOptions.vue';
import multiComboboxWithCustomOptionsSource from './examples/MultiComboboxWithCustomOptions.vue?raw';

const frameworks = [
	{ label: 'Next.js', value: 'next' },
	{ label: 'Nuxt', value: 'nuxt' },
	{ label: 'SvelteKit', value: 'svelte' },
	{ label: 'Remix', value: 'remix' },
	{ label: 'Astro', value: 'astro' },
];

const multiComboboxComponent: FunctionalComponent<ComponentPropsAndSlots<typeof MultiCombobox>> = MultiCombobox;

const meta: Meta<typeof MultiCombobox> = {
	title: 'Forms/MultiCombobox',
	component: multiComboboxComponent,
	tags: ['autodocs'],
	args: {
		options: frameworks,
		searchPlaceholder: 'Search framework…',
		emptyText: 'No framework found.',
	},
	render: render({ MultiCombobox }, `
    <div class="max-w-60">
      <MultiCombobox v-bind="args" />
    </div>
  `),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const PinSelectedOption: Story = {
	parameters: example(multiComboboxPinSelectedOptionSource),
	render: render({ MultiComboboxPinSelectedOption }, `
    <div class="max-w-60">
      <MultiComboboxPinSelectedOption />
    </div>
  `),
};

export const WithCustomOptions: Story = {
	parameters: example(multiComboboxWithCustomOptionsSource),
	render: render({ MultiComboboxWithCustomOptions }, `
    <div class="max-w-60">
      <MultiComboboxWithCustomOptions />
    </div>
  `),
};

export const CustomFooter: Story = {
	parameters: example(multiComboboxCustomFooterSource),
	render: render({ MultiComboboxCustomFooter }, `
    <div class="max-w-60">
      <MultiComboboxCustomFooter />
    </div>
  `),
};

export const HideFooter: Story = {
	args: { hideFooter: true },
};

export const Loading: Story = {
	args: { loading: true, loadingText: 'Loading…' },
};

export const Disabled: Story = {
	args: { disabled: true },
};
