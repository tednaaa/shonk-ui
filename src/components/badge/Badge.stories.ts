import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CheckIcon } from '@lucide/vue';
import { render, showControls } from '@/lib/storybook';
import { Badge } from '.';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  render: render({ Badge }, `<Badge v-bind="args">Badge</Badge>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Variants: Story = {
  render: render(
    { Badge },
    `<div class="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>`,
  ),
};

export const WithIcon: Story = {
  render: render(
    { Badge, CheckIcon },
    `<div class="flex flex-wrap items-center gap-2">
      <Badge><CheckIcon />Verified</Badge>
      <Badge variant="secondary"><CheckIcon />Active</Badge>
      <Badge variant="outline">99+</Badge>
    </div>`,
  ),
};
