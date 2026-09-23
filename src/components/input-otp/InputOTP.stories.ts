import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '.';

const meta: Meta<typeof InputOTP> = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  args: { maxlength: 6, inputmode: 'numeric' },
  render: render(
    { InputOTP, InputOTPGroup, InputOTPSlot },
    `<InputOTP v-bind="args">
      <InputOTPGroup>
        <InputOTPSlot v-for="index in args.maxlength" :key="index" :index="index - 1" />
      </InputOTPGroup>
    </InputOTP>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const WithSeparator: Story = {
  render: render(
    { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot },
    `<InputOTP :maxlength="6" inputmode="numeric">
      <InputOTPGroup>
        <InputOTPSlot :index="0" />
        <InputOTPSlot :index="1" />
        <InputOTPSlot :index="2" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot :index="3" />
        <InputOTPSlot :index="4" />
        <InputOTPSlot :index="5" />
      </InputOTPGroup>
    </InputOTP>`,
  ),
};

export const Invalid: Story = {
  render: render(
    { InputOTP, InputOTPGroup, InputOTPSlot },
    `<InputOTP :maxlength="4" inputmode="numeric" default-value="12">
      <InputOTPGroup>
        <InputOTPSlot v-for="index in 4" :key="index" :index="index - 1" invalid />
      </InputOTPGroup>
    </InputOTP>`,
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '123' },
};
