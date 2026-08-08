import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { Switch } from '.';
import { Label } from '../label';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  render: render({ Switch }, `<Switch v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Checked: Story = {
  args: { defaultValue: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultValue: true },
};

export const WithLabel: Story = {
  render: render({ Switch, Label }, `
    <Label class="gap-3">
      <Switch v-bind="args" />
      Airplane mode
    </Label>
  `),
};
