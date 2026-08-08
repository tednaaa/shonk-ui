import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Checkbox } from '.';
import { Label } from '../label';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  render: render({ Checkbox }, `<Checkbox v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Checked: Story = {
  args: { defaultValue: true },
};

export const Indeterminate: Story = {
  args: { defaultValue: 'indeterminate' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultValue: true },
};

export const WithLabel: Story = {
  render: render(
    { Checkbox, Label },
    `<div class="flex items-center gap-2">
      <Checkbox id="terms" v-bind="args" />
      <Label for="terms">Accept terms and conditions</Label>
    </div>`,
  ),
};
