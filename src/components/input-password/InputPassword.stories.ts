import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render, showControls } from '@/lib/storybook';
import { InputPassword } from '.';
import { Label } from '../label';
import InputPasswordPrefilled from './examples/InputPasswordPrefilled.vue';
import inputPasswordPrefilledSource from './examples/InputPasswordPrefilled.vue?raw';

const meta: Meta<typeof InputPassword> = {
  title: 'Components/InputPassword',
  component: InputPassword,
  tags: ['autodocs'],
  args: {
    name: 'password',
  },
  render: render({ InputPassword }, `<div class="max-w-xs"><InputPassword v-bind="args" /></div>`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Prefilled: Story = {
  parameters: example(inputPasswordPrefilledSource),
  render: render({ InputPasswordPrefilled }, `<div class="max-w-xs"><InputPasswordPrefilled /></div>`),
};

export const WithLabel: Story = {
  render: render(
    { InputPassword, Label },
    `<div class="grid max-w-xs gap-2">
      <Label for="password">Password</Label>
      <InputPassword name="password" />
    </div>`,
  ),
};
