import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Skeleton } from '.';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    class: 'h-4 w-[250px]',
  },
  render: render({ Skeleton }, `<Skeleton v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Profile: Story = {
  render: render(
    { Skeleton },
    `<div class="flex items-center gap-4">
      <Skeleton class="size-12 rounded-full" />
      <div class="grid gap-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>`,
  ),
};

export const Card: Story = {
  render: render(
    { Skeleton },
    `<div class="flex flex-col gap-3">
      <Skeleton class="h-[125px] w-[250px] rounded-xl" />
      <div class="grid gap-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>`,
  ),
};
