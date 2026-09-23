import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render, showControls } from '@/lib/storybook';
import { Progress } from '.';
import ProgressAnimated from './examples/ProgressAnimated.vue';
import progressAnimatedSource from './examples/ProgressAnimated.vue?raw';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { modelValue: 60, max: 100 },
  render: render({ Progress }, `<div class="max-w-sm"><Progress v-bind="args" /></div>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Steps: Story = {
  render: render(
    { Progress },
    `<div class="flex max-w-sm flex-col gap-4">
      <Progress :model-value="0" />
      <Progress :model-value="35" />
      <Progress :model-value="100" />
    </div>`,
  ),
};

export const CustomMax: Story = {
  args: { modelValue: 3, max: 5 },
};

export const Animated: Story = {
  parameters: example(progressAnimatedSource),
  render: render({ ProgressAnimated }, `<div class="max-w-sm"><ProgressAnimated /></div>`),
};
