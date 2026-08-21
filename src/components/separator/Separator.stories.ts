import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Separator } from '.';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  render: render(
    { Separator },
    `<div class="flex h-24 w-64 items-center justify-center">
      <Separator v-bind="args" />
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Demo: Story = {
  render: render(
    { Separator },
    `<div>
      <div class="space-y-1">
        <h4 class="text-sm leading-none font-medium">Acme UI</h4>
        <p class="text-text-tertiary text-sm">A shared component library.</p>
      </div>
      <Separator class="my-4" />
      <div class="flex h-5 items-center gap-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>`,
  ),
};
