import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, UnderlineIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { ToggleGroup, ToggleGroupItem } from '.';

const formatting = { ToggleGroup, ToggleGroupItem, BoldIcon, ItalicIcon, UnderlineIcon };

const meta: Meta<typeof ToggleGroup> = {
	title: 'Actions/ToggleGroup',
	component: ToggleGroup,
	tags: ['autodocs'],
	args: { type: 'multiple', spacing: 1 },
	render: render(
		formatting,
		`<ToggleGroup v-bind="args">
      <ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon /></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroupItem>
    </ToggleGroup>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Single: Story = {
	render: render(
		{ ToggleGroup, ToggleGroupItem, AlignLeftIcon, AlignCenterIcon, AlignRightIcon },
		`<ToggleGroup type="single" default-value="left" :spacing="1">
      <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
    </ToggleGroup>`,
	),
};

export const Outline: Story = {
	render: render(
		formatting,
		`<ToggleGroup type="multiple" variant="outline" :spacing="1" :default-value="['bold']">
      <ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon /></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroupItem>
    </ToggleGroup>`,
	),
};

export const Joined: Story = {
	render: render(
		{ ToggleGroup, ToggleGroupItem },
		`<ToggleGroup type="single" variant="outline" default-value="week">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>`,
	),
};
