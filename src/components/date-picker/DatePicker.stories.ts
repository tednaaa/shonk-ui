import type { DateValue } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { example, render, showControls, StoryLabel } from '@/lib/storybook';
import { DatePicker } from '.';
import DatePickerPreselected from './examples/DatePickerPreselected.vue';
import datePickerPreselectedSource from './examples/DatePickerPreselected.vue?raw';
import DatePickerWithPresets from './examples/DatePickerWithPresets.vue';
import datePickerWithPresetsSource from './examples/DatePickerWithPresets.vue?raw';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    triggerPlaceholder: 'Pick a date',
  },
  render: render({ DatePicker }, `<DatePicker v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Preselected: Story = {
  parameters: example(datePickerPreselectedSource),
  render: render({ DatePickerPreselected }, `<DatePickerPreselected />`),
};

export const MinValue: Story = {
  args: { minValue: new CalendarDate(2026, 6, 17) },
  render: render(
    { DatePicker, StoryLabel },
    `<div class="grid gap-2"><StoryLabel>Dates before Jun 17 are disabled</StoryLabel><DatePicker v-bind="args" /></div>`,
  ),
};

export const MaxValue: Story = {
  args: { maxValue: new CalendarDate(2026, 6, 17) },
  render: render(
    { DatePicker, StoryLabel },
    `<div class="grid gap-2"><StoryLabel>Dates after Jun 17 are disabled</StoryLabel><DatePicker v-bind="args" /></div>`,
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
    { DatePicker, StoryLabel },
    `<div class="grid gap-2"><StoryLabel>Weekends are disabled</StoryLabel><DatePicker v-bind="args" /></div>`,
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
  parameters: example(datePickerWithPresetsSource),
  render: render({ DatePickerWithPresets }, `<DatePickerWithPresets />`),
};
