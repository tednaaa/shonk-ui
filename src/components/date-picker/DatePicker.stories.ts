import type { DateValue } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { ref } from 'vue';
import { render, showControls, StoryLabel } from '@/lib/storybook';
import { DatePicker } from '.';
import { Button } from '../button';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    placeholder: 'Pick a date',
  },
  render: render({ DatePicker }, `<DatePicker v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Preselected: Story = {
  render: args => ({
    components: { DatePicker },
    setup() {
      const date = ref(new Date(2026, 5, 15));
      return { args, date };
    },
    template: `<DatePicker v-bind="args" v-model="date" />`,
  }),
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
  render: args => ({
    components: { DatePicker, Button },
    setup() {
      const date = ref<Date>();
      function setDaysFromNow(days: number) {
        date.value = new Date(2026, 5, 17 + days);
      }
      return { args, date, setDaysFromNow };
    },
    template: `
      <DatePicker v-bind="args" v-model="date">
        <div class="flex flex-col gap-1 border-l p-2">
          <Button variant="ghost" class="justify-start" @click="setDaysFromNow(0)">Today</Button>
          <Button variant="ghost" class="justify-start" @click="setDaysFromNow(1)">Tomorrow</Button>
          <Button variant="ghost" class="justify-start" @click="setDaysFromNow(7)">In a week</Button>
        </div>
      </DatePicker>
    `,
  }),
};
