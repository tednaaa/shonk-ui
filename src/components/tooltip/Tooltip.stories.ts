import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '.';
import { Button } from '../button';

const components = {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	Button,
};

const meta: Meta<typeof Tooltip> = {
	title: 'Overlays/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
	args: { content: 'Add to library' },
	render: render(components, `
  <Tooltip v-bind="args">
    <Button variant="secondary">Hover me</Button>
  </Tooltip>
`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Sides: Story = {
	render: render(components, `
  <div class="flex flex-wrap gap-2">
    <Tooltip
      v-for="side in ['top', 'right', 'bottom', 'left']"
      :key="side"
      :side="side"
      :content="side + ' tooltip'"
    >
      <Button variant="secondary" class="capitalize">{{ side }}</Button>
    </Tooltip>
  </div>
`),
};

export const RichContent: Story = {
	render: render(components, `
  <Tooltip>
    <Button variant="secondary">Save</Button>
    <template #content>
      Save changes <kbd class="font-mono">Ctrl+S</kbd>
    </template>
  </Tooltip>
`),
};

export const Composed: Story = {
	render: render(components, `
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="secondary">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" :side-offset="8">
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
`),
};
