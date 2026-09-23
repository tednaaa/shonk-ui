import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { DotIcon } from '@lucide/vue';
import { example, render, showControls, StorybookLabel } from '@/lib/storybook';
import { InputOTP, REGEXP_ONLY_DIGITS } from '.';
import InputOTPPasteTransformer from './examples/InputOTPPasteTransformer.vue';
import inputOTPPasteTransformerSource from './examples/InputOTPPasteTransformer.vue?raw';

const meta: Meta<typeof InputOTP> = {
  title: 'Components/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  render: render({ InputOTP }, `<InputOTP v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const WithValue: Story = {
  args: { defaultValue: '123456' },
};

export const Grouped: Story = {
  args: { groupSize: 3, defaultValue: '123456' },
};

export const CustomSeparator: Story = {
  render: render(
    { InputOTP, DotIcon },
    `<InputOTP :group-size="2" default-value="123456">
      <template #separator>
        <DotIcon />
      </template>
    </InputOTP>`,
  ),
};

export const Masked: Story = {
  args: { mask: true, defaultValue: '1234' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: '•' },
};

export const DigitsOnly: Story = {
  args: { pattern: REGEXP_ONLY_DIGITS, inputmode: 'numeric' },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: '1234' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '123' },
};

export const PasteTransformer: Story = {
  parameters: example(inputOTPPasteTransformerSource),
  render: render({ InputOTPPasteTransformer, StorybookLabel }, `
    <div class="space-y-2">
      <StorybookLabel>Copy text below and paste it</StorybookLabel>
      <code class="block max-w-xl rounded-md bg-muted px-2 py-1 text-sm text-foreground select-all">Your verification code is 123-456. It expires in 10 minutes.</code>
      <InputOTPPasteTransformer />
    </div>
  `),
};
