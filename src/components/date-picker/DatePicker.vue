<script setup lang="ts">
import type { DateValue } from '@internationalized/date';
import type { WeekStartsOn } from 'reka-ui/date';
import { CalendarDate } from '@internationalized/date';
import { CalendarIcon } from '@lucide/vue';
import { computed, ref } from 'vue';
import { formatDate } from '@/lib/date';
import { cn } from '@/utils';
import { Button } from '../button';
import { Calendar } from '../calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../popover';

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

const date = defineModel<Date>();
const open = ref(false);

const calendarValue = computed<DateValue | undefined>(() => {
  const value = date.value;
  return value ? new CalendarDate(value.getFullYear(), value.getMonth() + 1, value.getDate()) : undefined;
});

function onUpdate(value: DateValue | undefined) {
  date.value = value ? new Date(value.year, value.month - 1, value.day, 0, 0, 0, 0) : undefined;

  if (props.closeOnSelect && value)
    open.value = false;
}

const displayValue = computed(() => {
  return date.value ? formatDate(date.value, props.formatter) : '';
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
        <Calendar
          class="w-72"
          disable-days-outside-current-view
          :week-starts-on="props.weekStartsOn"
          :model-value="calendarValue"
          :min-value="props.minValue"
          :max-value="props.maxValue"
          :is-date-disabled="props.isDateDisabled"
          @update:model-value="onUpdate"
        />

        <slot />
      </div>
    </PopoverContent>
  </Popover>
</template>
