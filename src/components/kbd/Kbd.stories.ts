import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CommandIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { Kbd, KbdGroup } from '.';

const meta: Meta<typeof Kbd> = {
	title: 'Data/Kbd',
	component: Kbd,
	tags: ['autodocs'],
	render: render({ Kbd }, `<Kbd v-bind="args">Esc</Kbd>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Group: Story = {
	render: render(
		{ Kbd, KbdGroup, CommandIcon },
		`<div class="flex flex-col items-start gap-3">
      <KbdGroup>
        <Kbd><CommandIcon /></Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span>+</span>
        <Kbd>Shift</Kbd>
        <span>+</span>
        <Kbd>P</Kbd>
      </KbdGroup>
    </div>`,
	),
};

export const InText: Story = {
	render: render(
		{ Kbd, KbdGroup },
		`<p class="text-sm text-muted-foreground">
      Press <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup> to open the command palette.
    </p>`,
	),
};
