import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Label } from '.';
import { Checkbox } from '../checkbox';
import { Input } from '../input';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  render: render({ Label }, `<Label v-bind="args">Email address</Label>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Required: Story = {
  args: { required: true },
};

export const WithInput: Story = {
  render: render(
    { Label, Input },
    `<div class="grid max-w-xs gap-2">
      <Label for="email" required>Email</Label>
      <Input id="email" type="email" placeholder="Email" />
    </div>`,
  ),
};

export const WithCheckbox: Story = {
  render: render(
    { Label, Checkbox },
    `<div class="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label for="terms">Accept terms and conditions</Label>
    </div>`,
  ),
};
