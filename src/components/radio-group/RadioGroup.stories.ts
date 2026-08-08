import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import { RadioGroup, RadioGroupItem } from '.';
import { Label } from '../label';

const components = { RadioGroup, RadioGroupItem, Label };

const row
  = 'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-base font-normal transition-colors hover:bg-bg-muted has-[[data-state=checked]]:bg-bg-brand-subtle has-[[data-state=checked]]:hover:bg-bg-brand-subtle has-[[data-state=checked]]:font-semibold';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    defaultValue: 'spam',
  },
  render: render(
    components,
    `<RadioGroup v-bind="args" class="max-w-sm gap-1">
      <Label class="${row}">
        <RadioGroupItem value="spam" />
        Спам
      </Label>
      <Label class="${row}">
        <RadioGroupItem value="silence" />
        Тишина не системная
      </Label>
      <Label class="${row}">
        <RadioGroupItem value="lag" />
        Залагал автоответчик
      </Label>
      <Label class="${row}">
        <RadioGroupItem value="bot" />
        Позвонил бот
      </Label>
    </RadioGroup>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Inline: Story = {
  args: { defaultValue: 'comfortable' },
  render: render(
    components,
    `<RadioGroup v-bind="args">
      <div class="flex items-center gap-2">
        <RadioGroupItem id="r1" value="default" />
        <Label for="r1">Default</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem id="r2" value="comfortable" />
        <Label for="r2">Comfortable</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem id="r3" value="compact" />
        <Label for="r3">Compact</Label>
      </div>
    </RadioGroup>`,
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledItem: Story = {
  render: render(
    components,
    `<RadioGroup default-value="card" class="max-w-sm gap-1">
      <Label class="${row}">
        <RadioGroupItem value="card" />
        Card
      </Label>
      <Label class="${row} has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
        <RadioGroupItem value="paypal" disabled />
        PayPal (unavailable)
      </Label>
      <Label class="${row}">
        <RadioGroupItem value="apple" />
        Apple Pay
      </Label>
    </RadioGroup>`,
  ),
};
