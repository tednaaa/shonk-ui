import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '.';
import { Button } from '../button';

const components = {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Button,
};

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  render: render(
    components,
    `<TooltipProvider>
      <Tooltip v-bind="args">
        <TooltipTrigger as-child>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Sides: Story = {
  render: render(
    components,
    `<TooltipProvider>
      <div class="flex flex-wrap gap-2">
        <Tooltip v-for="side in ['top', 'right', 'bottom', 'left']" :key="side">
          <TooltipTrigger as-child>
            <Button variant="outline" class="capitalize">{{ side }}</Button>
          </TooltipTrigger>
          <TooltipContent :side="side">
            <p class="capitalize">{{ side }} tooltip</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>`,
  ),
};
