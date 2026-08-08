import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Slider } from '.';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { defaultValue: [50], min: 0, max: 100, step: 1 },
  render: render({ Slider }, `<div class="max-w-sm"><Slider v-bind="args" /></div>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Range: Story = {
  args: { defaultValue: [25, 75] },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Vertical: Story = {
  render: render(
    { Slider },
    `<div class="h-52">
      <Slider :default-value="[50]" orientation="vertical" />
    </div>`,
  ),
};
