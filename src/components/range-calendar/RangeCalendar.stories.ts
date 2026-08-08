import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CalendarDate } from '@internationalized/date';
import { render, showControls } from '@/lib/storybook';
import { RangeCalendar } from '.';

const meta: Meta<typeof RangeCalendar> = {
  title: 'Components/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  render: render(
    { RangeCalendar },
    `<div class="max-w-fit rounded-lg border">
      <RangeCalendar v-bind="args" />
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Selected: Story = {
  args: {
    defaultValue: {
      start: new CalendarDate(2026, 6, 8),
      end: new CalendarDate(2026, 6, 14),
    },
  },
};

export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
    defaultPlaceholder: new CalendarDate(2026, 6, 1),
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
