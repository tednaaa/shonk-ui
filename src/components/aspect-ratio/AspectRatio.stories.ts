import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls, StorybookLabel } from '@/lib/storybook';
import { AspectRatio } from '.';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  args: { ratio: 16 / 9 },
  render: render(
    { AspectRatio, StorybookLabel },
    `<div class="w-100 space-y-2">
      <StorybookLabel>{{ args.ratio }}</StorybookLabel>
      <AspectRatio v-bind="args">
        <div class="bg-muted h-full w-full rounded-lg"></div>
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
    { AspectRatio, StorybookLabel },
    `<div class="flex items-end gap-6">
      <div class="w-40 space-y-2">
        <StorybookLabel>16 / 9</StorybookLabel>
        <AspectRatio :ratio="16 / 9">
          <div class="bg-muted h-full w-full rounded-lg"></div>
        </AspectRatio>
      </div>
      <div class="w-40 space-y-2">
        <StorybookLabel>4 / 3</StorybookLabel>
        <AspectRatio :ratio="4 / 3">
          <div class="bg-muted h-full w-full rounded-lg"></div>
        </AspectRatio>
      </div>
      <div class="w-40 space-y-2">
        <StorybookLabel>1 / 1</StorybookLabel>
        <AspectRatio :ratio="1">
          <div class="bg-muted h-full w-full rounded-lg"></div>
        </AspectRatio>
      </div>
    </div>`,
  ),
};

export const Image: Story = {
  render: render(
    { AspectRatio, StorybookLabel },
    `<div class="w-112.5 space-y-2">
      <StorybookLabel>16 / 9</StorybookLabel>
      <AspectRatio :ratio="16 / 9">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Landscape"
          class="border-border h-full w-full rounded-lg border object-cover"
        />
      </AspectRatio>
    </div>`,
  ),
};
