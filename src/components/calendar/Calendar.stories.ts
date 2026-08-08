import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CalendarDate } from '@internationalized/date';
import { render, showControls } from '@/lib/storybook';
import { Calendar } from '.';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  render: render(
    { Calendar },
    `<div class="max-w-fit rounded-lg border">
      <Calendar v-bind="args" />
    </div>`,
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: showControls,
};

export const Selected: Story = {
  args: { defaultValue: new CalendarDate(2026, 6, 17) },
};

export const WithDropdowns: Story = {
  args: { layout: 'month-and-year', defaultPlaceholder: new CalendarDate(2026, 6, 1) },
};

export const MultipleMonths: Story = {
  args: { numberOfMonths: 2, defaultPlaceholder: new CalendarDate(2026, 6, 1) },
};

export const Disabled: Story = {
  args: { disabled: true },
};
