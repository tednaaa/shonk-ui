import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls, StoryLabel } from '@/lib/storybook';
import { Input } from '.';
import { Label } from '../label';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  render: render({ Input }, `<div class="max-w-xs"><Input v-bind="args" placeholder="Email" /></div>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const WithValue: Story = {
  args: { defaultValue: 'hello@example.com' },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'not-an-email' },
};

export const Disabled: Story = {
  render: render({ Input }, `<div class="max-w-xs"><Input placeholder="Disabled" disabled /></div>`),
};

export const Readonly: Story = {
  render: render({ Input }, `<div class="max-w-xs"><Input model-value="hello@example.com" readonly /></div>`),
};

export const WithLabel: Story = {
  render: render(
    { Input, Label },
    `<div class="grid max-w-xs gap-2">
      <Label for="email">Email</Label>
      <Input id="email" type="email" placeholder="Email" />
    </div>`,
  ),
};

export const Types: Story = {
  render: render(
    { Input, StoryLabel },
    `<div class="flex max-w-xs flex-col gap-4">
      <div class="grid gap-2"><StoryLabel>Text</StoryLabel><Input type="text" placeholder="Text" /></div>
      <div class="grid gap-2"><StoryLabel>Email</StoryLabel><Input type="email" placeholder="email@example.com" /></div>
      <div class="grid gap-2"><StoryLabel>Number</StoryLabel><Input type="number" placeholder="0" /></div>
      <div class="grid gap-2"><StoryLabel>File</StoryLabel><Input type="file" /></div>
    </div>`,
  ),
};
