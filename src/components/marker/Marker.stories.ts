import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CheckCircle2Icon, GitBranchIcon, SparklesIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { Marker, MarkerContent, MarkerIcon } from '.';

const components = { Marker, MarkerContent, MarkerIcon, CheckCircle2Icon, GitBranchIcon, SparklesIcon };

const meta: Meta<typeof Marker> = {
	title: 'Chat/Marker',
	component: Marker,
	tags: ['autodocs'],
	render: render(
		components,
		`<Marker v-bind="args" class="max-w-md">
      <MarkerIcon><SparklesIcon /></MarkerIcon>
      <MarkerContent>Thought for 4 seconds</MarkerContent>
    </Marker>`,
	),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Separator: Story = {
	render: render(
		components,
		`<div class="flex max-w-md flex-col gap-4">
      <Marker variant="separator"><MarkerContent>Today</MarkerContent></Marker>
      <Marker variant="separator"><MarkerContent>3 new messages</MarkerContent></Marker>
    </div>`,
	),
};

export const Border: Story = {
	render: render(
		components,
		`<Marker variant="border" class="max-w-md">
      <MarkerIcon><GitBranchIcon /></MarkerIcon>
      <MarkerContent>Branched from <a href="#">the previous conversation</a></MarkerContent>
    </Marker>`,
	),
};

export const StatusRow: Story = {
	render: render(
		components,
		`<div class="flex max-w-md flex-col gap-2">
      <Marker>
        <MarkerIcon><CheckCircle2Icon class="text-success" /></MarkerIcon>
        <MarkerContent>Deployed to staging</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon><CheckCircle2Icon class="text-success" /></MarkerIcon>
        <MarkerContent>Tests passed</MarkerContent>
      </Marker>
    </div>`,
	),
};
