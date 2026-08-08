import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls, StoryLabel } from '@/lib/storybook';
import { AspectRatio } from '.';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  args: { ratio: 16 / 9 },
  render: render(
    { AspectRatio, StoryLabel },
    `<div class="w-100 space-y-2">
      <StoryLabel>{{ args.ratio }}</StoryLabel>
      <AspectRatio v-bind="args">
        <div class="bg-bg-muted h-full w-full rounded-lg"></div>
      </AspectRatio>
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Ratios: Story = {
  render: render(
    { AspectRatio, StoryLabel },
    `<div class="flex items-end gap-6">
      <div class="w-40 space-y-2">
        <StoryLabel>16 / 9</StoryLabel>
        <AspectRatio :ratio="16 / 9">
          <div class="bg-bg-muted h-full w-full rounded-lg"></div>
        </AspectRatio>
      </div>
      <div class="w-40 space-y-2">
        <StoryLabel>4 / 3</StoryLabel>
        <AspectRatio :ratio="4 / 3">
          <div class="bg-bg-muted h-full w-full rounded-lg"></div>
        </AspectRatio>
      </div>
      <div class="w-40 space-y-2">
        <StoryLabel>1 / 1</StoryLabel>
        <AspectRatio :ratio="1">
          <div class="bg-bg-muted h-full w-full rounded-lg"></div>
        </AspectRatio>
      </div>
    </div>`,
  ),
};

export const Image: Story = {
  render: render(
    { AspectRatio, StoryLabel },
    `<div class="w-112.5 space-y-2">
      <StoryLabel>16 / 9</StoryLabel>
      <AspectRatio :ratio="16 / 9">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Landscape"
          class="border-border-default h-full w-full rounded-lg border object-cover"
        />
      </AspectRatio>
    </div>`,
  ),
};
