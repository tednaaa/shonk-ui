<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import type { DateRange } from 'reka-ui';

import type { WeekStartsOn } from 'reka-ui/date';
import { CalendarDate } from '@internationalized/date';
import { CalendarIcon } from '@lucide/vue';
import { computed, ref } from 'vue';
import { formatDate } from '@/lib/date';
import { cn } from '@/utils';
import { Button } from '../button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover';
import { RangeCalendar } from '../range-calendar';

const props = withDefaults(defineProps<{
  placeholder?: string;
  closeOnSelect?: boolean;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDateDisabled?: (date: DateValue) => boolean;
  formatter?: (date: Date) => string;
  weekStartsOn?: WeekStartsOn;
}>(), {
  placeholder: 'Выберите дату',
  closeOnSelect: true,
  weekStartsOn: 1,
});

const dates = defineModel<Date[]>({ default: () => [] });
const open = ref(false);

const calendarValue = computed<DateRange>(() => {
  const [start, end] = dates.value;
  return {
    start: start ? new CalendarDate(start.getFullYear(), start.getMonth() + 1, start.getDate()) : undefined,
    end: end ? new CalendarDate(end.getFullYear(), end.getMonth() + 1, end.getDate()) : undefined,
  };
});

function onRangeUpdate(range: DateRange) {
  const start = range.start ? new Date(range.start.year, range.start.month - 1, range.start.day, 0, 0, 0, 0) : undefined;
  const end = range.end ? new Date(range.end.year, range.end.month - 1, range.end.day, 23, 59, 59, 999) : undefined;

  dates.value = start && end ? [start, end] : start ? [start] : [];

  if (props.closeOnSelect && start && end)
    open.value = false;
}

const displayValue = computed(() => {
  const [start, end] = dates.value;
  if (start && end)
    return `${formatDate(start, props.formatter)} – ${formatDate(end, props.formatter)}`;
  if (start)
    return formatDate(start, props.formatter);
  return '';
});

function close() {
  open.value = false;
}

defineExpose({ close });
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('w-55 justify-start text-left font-normal', !displayValue && 'text-text-tertiary')"
      >
        <CalendarIcon :size="16" />
        <span>{{ displayValue || props.placeholder }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" side="top" class="w-auto overflow-hidden p-0">
      <div class="flex">
        <RangeCalendar
          class="w-72"
          disable-days-outside-current-view
          :week-starts-on="props.weekStartsOn"
          :model-value="calendarValue"
          :min-value="props.minValue"
          :max-value="props.maxValue"
          :is-date-disabled="props.isDateDisabled"
          @update:model-value="onRangeUpdate"
        />

        <slot />
      </div>
    </PopoverContent>
  </Popover>
</template>
