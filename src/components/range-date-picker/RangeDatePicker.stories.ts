import type { DateValue } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { example, render, showControls, StoryLabel } from '@/lib/storybook';
import { RangeDatePicker } from '.';
import RangeDatePickerPreselected from './examples/RangeDatePickerPreselected.vue';
import rangeDatePickerPreselectedSource from './examples/RangeDatePickerPreselected.vue?raw';
import RangeDatePickerWithPresets from './examples/RangeDatePickerWithPresets.vue';
import rangeDatePickerWithPresetsSource from './examples/RangeDatePickerWithPresets.vue?raw';

const meta: Meta<typeof RangeDatePicker> = {
  title: 'Components/RangeDatePicker',
  component: RangeDatePicker,
  tags: ['autodocs'],
  args: {
    triggerPlaceholder: 'Pick a date range',
  },
  render: render({ RangeDatePicker }, `<RangeDatePicker v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Preselected: Story = {
  parameters: example(rangeDatePickerPreselectedSource),
  render: render({ RangeDatePickerPreselected }, `<RangeDatePickerPreselected />`),
};

export const MinValue: Story = {
  args: { minValue: new CalendarDate(2026, 6, 17) },
  render: render(
    { RangeDatePicker, StoryLabel },
    `<div class="grid gap-2"><StoryLabel>Dates before Jun 17 are disabled</StoryLabel><RangeDatePicker v-bind="args" /></div>`,
  ),
};

export const MaxValue: Story = {
  args: { maxValue: new CalendarDate(2026, 6, 17) },
  render: render(
    { RangeDatePicker, StoryLabel },
    `<div class="grid gap-2"><StoryLabel>Dates after Jun 17 are disabled</StoryLabel><RangeDatePicker v-bind="args" /></div>`,
  ),
};

export const DisabledWeekends: Story = {
  args: {
    isDateDisabled: (date: DateValue) => {
      const day = date.toDate(getLocalTimeZone()).getDay();
      return day === 0 || day === 6;
    },
  },
  render: render(
    { RangeDatePicker, StoryLabel },
    `<div class="grid gap-2"><StoryLabel>Weekends are disabled</StoryLabel><RangeDatePicker v-bind="args" /></div>`,
  ),
};

export const CustomFormatter: Story = {
  args: {
    formatter: (date: Date) =>
      new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date),
  },
};

export const StayOpen: Story = {
  args: { closeOnSelect: false },
};

export const WithPresets: Story = {
  parameters: example(rangeDatePickerWithPresetsSource),
  render: render({ RangeDatePickerWithPresets }, `<RangeDatePickerWithPresets />`),
};
