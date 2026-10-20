import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '.';

const components = { Bubble, BubbleContent, BubbleGroup, BubbleReactions };

const meta: Meta<typeof Bubble> = {
	title: 'Chat/Bubble',
	component: Bubble,
	tags: ['autodocs'],
	render: render(
		components,
		`<Bubble v-bind="args">
      <BubbleContent>Hey, are we still on for tomorrow?</BubbleContent>
    </Bubble>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Variants: Story = {
	render: render(
		components,
		`<div class="flex max-w-lg flex-col gap-2">
      <Bubble v-for="variant in ['default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive']" :key="variant" :variant="variant">
        <BubbleContent class="capitalize">{{ variant }}</BubbleContent>
      </Bubble>
    </div>`,
	),
};

export const Alignment: Story = {
	render: render(
		components,
		`<div class="flex max-w-lg flex-col gap-2">
      <Bubble variant="secondary"><BubbleContent>Incoming, aligned to the start.</BubbleContent></Bubble>
      <Bubble align="end"><BubbleContent>Outgoing, aligned to the end.</BubbleContent></Bubble>
    </div>`,
	),
};

export const Grouped: Story = {
	render: render(
		components,
		`<BubbleGroup class="max-w-lg">
      <Bubble variant="secondary"><BubbleContent>First line of a burst.</BubbleContent></Bubble>
      <Bubble variant="secondary"><BubbleContent>Second one, sent right after.</BubbleContent></Bubble>
      <Bubble variant="secondary"><BubbleContent>And a third.</BubbleContent></Bubble>
    </BubbleGroup>`,
	),
};

export const Reactions: Story = {
	render: render(
		components,
		`<div class="flex max-w-lg flex-col gap-8 py-4">
      <Bubble variant="secondary">
        <BubbleContent>Shipped the release notes.</BubbleContent>
        <BubbleReactions>👍 2</BubbleReactions>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Nice, thanks!</BubbleContent>
        <BubbleReactions side="top" align="start">🎉</BubbleReactions>
      </Bubble>
    </div>`,
	),
};

export const Interactive: Story = {
	render: render(
		components,
		`<Bubble variant="outline">
      <BubbleContent as="button" type="button">Suggested reply: "Sounds good"</BubbleContent>
    </Bubble>`,
	),
};
