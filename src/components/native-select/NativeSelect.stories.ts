import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { example, render, showControls } from '@/lib/storybook';
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '.';
import { Label } from '../label';
import NativeSelectPreselected from './examples/NativeSelectPreselected.vue';
import nativeSelectPreselectedSource from './examples/NativeSelectPreselected.vue?raw';

const components = {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
  Label,
};

const meta: Meta<typeof NativeSelect> = {
  title: 'Components/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  render: render(
    components,
    `<NativeSelect v-bind="args">
      <NativeSelectOption value="" disabled>Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      <NativeSelectOption value="grapes">Grapes</NativeSelectOption>
    </NativeSelect>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Preselected: Story = {
  parameters: example(nativeSelectPreselectedSource),
  render: render({ NativeSelectPreselected }, `<NativeSelectPreselected />`),
};

export const WithOptGroups: Story = {
  render: render(
    components,
    `<NativeSelect>
      <NativeSelectOptGroup label="Fruits">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Vegetables">
        <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
        <NativeSelectOption value="potato">Potato</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>`,
  ),
};

export const WithLabel: Story = {
  render: render(
    components,
    `<div class="grid gap-2">
      <Label for="fruit">Favorite fruit</Label>
      <NativeSelect id="fruit">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelect>
    </div>`,
  ),
};

export const Disabled: Story = {
  render: render(
    components,
    `<NativeSelect disabled>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
    </NativeSelect>`,
  ),
};

export const Invalid: Story = {
  render: render(
    components,
    `<NativeSelect aria-invalid="true">
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
    </NativeSelect>`,
  ),
};
