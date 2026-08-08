import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { render, showControls } from '@/lib/storybook';
import { InputPassword } from '.';
import { Label } from '../label';

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
  render: () => ({
    components: { InputPassword },
    setup() {
      const password = ref('super-secret');
      return { password };
    },
    template: `<div class="max-w-xs"><InputPassword v-model="password" name="password" /></div>`,
  }),
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
