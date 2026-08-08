import type { DateValue } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { ref } from 'vue';
import { render, showControls, StoryLabel } from '@/lib/storybook';
import { RangeDatePicker } from '.';
import { Button } from '../button';

const meta: Meta<typeof RangeDatePicker> = {
  title: 'Components/RangeDatePicker',
  component: RangeDatePicker,
  tags: ['autodocs'],
  args: {
    placeholder: 'Pick a date range',
  },
  render: render({ RangeDatePicker }, `<RangeDatePicker v-bind="args" />`),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Preselected: Story = {
  render: args => ({
    components: { RangeDatePicker },
    setup() {
      const dates = ref([new Date(2026, 5, 1), new Date(2026, 5, 15)]);
      return { args, dates };
    },
    template: `<RangeDatePicker v-bind="args" v-model="dates" />`,
  }),
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
  render: args => ({
    components: { RangeDatePicker, Button },
    setup() {
      const dates = ref<Date[]>([]);
      function setLastDays(days: number) {
        const end = new Date(2026, 5, 17);
        const start = new Date(2026, 5, 17 - days);
        dates.value = [start, end];
      }
      return { args, dates, setLastDays };
    },
    template: `
      <RangeDatePicker v-bind="args" v-model="dates">
        <div class="flex flex-col gap-1 border-l p-2">
          <Button variant="ghost" class="justify-start" @click="setLastDays(7)">Last 7 days</Button>
          <Button variant="ghost" class="justify-start" @click="setLastDays(30)">Last 30 days</Button>
          <Button variant="ghost" class="justify-start" @click="setLastDays(90)">Last 90 days</Button>
        </div>
      </RangeDatePicker>
    `,
  }),
};
