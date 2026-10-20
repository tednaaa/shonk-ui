import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { render, showControls } from '@/lib/storybook';
import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
} from '.';
import { Label } from '../label';

const components = {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
	Label,
};

const meta: Meta<typeof NumberField> = {
	title: 'Forms/NumberField',
	component: NumberField,
	tags: ['autodocs'],
	args: { id: 'quantity', defaultValue: 1, min: 0, max: 10, step: 1 },
	render: render(components, `
  <NumberField v-bind="args" class="w-40">
    <Label for="quantity">Quantity</Label>
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: showControls,
};

export const Decimal: Story = {
	render: render(components, `
  <NumberField id="price" :default-value="9.99" :step="0.01" :format-options="{ style: 'currency', currency: 'USD' }" class="w-40">
    <Label for="price">Price</Label>
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
`),
};

export const Percent: Story = {
	render: render(components, `
  <NumberField id="discount" :default-value="0.15" :min="0" :max="1" :step="0.05" :format-options="{ style: 'percent' }" class="w-40">
    <Label for="discount">Discount</Label>
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
`),
};

export const Disabled: Story = {
	render: render(components, `
  <NumberField id="seats" :default-value="4" disabled class="w-40">
    <Label for="seats">Seats</Label>
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
`),
};
