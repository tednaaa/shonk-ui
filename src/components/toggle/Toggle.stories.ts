import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { BoldIcon, BookmarkIcon, ItalicIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { Toggle } from '.';

const meta: Meta<typeof Toggle> = {
	title: 'Actions/Toggle',
	component: Toggle,
	tags: ['autodocs'],
	render: render(
		{ Toggle, BoldIcon },
		`<Toggle v-bind="args" aria-label="Bold"><BoldIcon /></Toggle>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Outline: Story = {
	render: render(
		{ Toggle, ItalicIcon },
		`<Toggle variant="outline" aria-label="Italic"><ItalicIcon /></Toggle>`,
	),
};

export const WithText: Story = {
	render: render(
		{ Toggle, BookmarkIcon },
		`<Toggle variant="outline" :default-value="true" class="data-[state=on]:*:[svg]:fill-current"><BookmarkIcon />Bookmark</Toggle>`,
	),
};

export const Sizes: Story = {
	render: render(
		{ Toggle, BoldIcon },
		`<div class="flex items-center gap-2">
      <Toggle v-for="size in ['sm', 'default', 'lg']" :key="size" :size="size" variant="outline" aria-label="Bold">
        <BoldIcon />
      </Toggle>
    </div>`,
	),
};

export const Disabled: Story = {
	render: render(
		{ Toggle, BoldIcon },
		`<Toggle disabled aria-label="Bold"><BoldIcon /></Toggle>`,
	),
};
