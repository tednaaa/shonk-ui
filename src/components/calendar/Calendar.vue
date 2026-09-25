<script lang="ts" setup>
import type { AcceptableValue, CalendarRootEmits, CalendarRootProps, DateValue } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { createReusableTemplate, reactiveOmit } from '@vueuse/core';
import { CalendarRoot, useDateFormatter, useForwardPropsEmits } from 'reka-ui';
import { createYear, createYearRange, toDate } from 'reka-ui/date';
import { computed, toRaw, watch } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { NativeSelect, NativeSelectOption } from '../native-select';
import CalendarCell from './CalendarCell.vue';
import CalendarCellTrigger from './CalendarCellTrigger.vue';
import CalendarGrid from './CalendarGrid.vue';
import CalendarGridBody from './CalendarGridBody.vue';
import CalendarGridHead from './CalendarGridHead.vue';
import CalendarGridRow from './CalendarGridRow.vue';
import CalendarHeadCell from './CalendarHeadCell.vue';
import CalendarHeader from './CalendarHeader.vue';
import CalendarHeading from './CalendarHeading.vue';
import CalendarNextButton from './CalendarNextButton.vue';
import CalendarPrevButton from './CalendarPrevButton.vue';

export type LayoutTypes = 'month-and-year' | 'month-only' | 'year-only' | undefined;

const props = withDefaults(defineProps<Omit<CalendarRootProps, 'placeholder'> & { class?: HTMLAttributes['class']; layout?: LayoutTypes; yearRange?: DateValue[] }>(), {
  modelValue: undefined,
  layout: undefined,
  weekdayFormat: 'short',
});
const emits = defineEmits<Omit<CalendarRootEmits, 'update:placeholder'>>();

const placeholder = defineModel<DateValue>('placeholder', {
  default: (rawProps: Pick<CalendarRootProps, 'defaultPlaceholder'>) => rawProps.defaultPlaceholder ?? today(getLocalTimeZone()),
});

const initialPlaceholder = toRaw(placeholder.value);

const delegatedProps = reactiveOmit(props, 'class', 'layout', 'locale');

const uiLocale = useLocale();

const localeCode = computed(() => props.locale ?? uiLocale.value.intlLocale);

const formatter = useDateFormatter(localeCode.value);

watch(localeCode, code => formatter.setLocale(code));

const yearRange = computed(() => {
  return props.yearRange ?? createYearRange({
    start: props.minValue ?? initialPlaceholder.cycle('year', -100),
    end: props.maxValue ?? initialPlaceholder.cycle('year', 10),
  });
});

function showMonth(month: AcceptableValue | AcceptableValue[]) {
  placeholder.value = placeholder.value.set({ month: Number(month) });
}

function showYear(year: AcceptableValue | AcceptableValue[]) {
  placeholder.value = placeholder.value.set({ year: Number(year) });
}

const [DefineMonthTemplate, ReuseMonthTemplate] = createReusableTemplate<{ date: DateValue }>();
const [DefineYearTemplate, ReuseYearTemplate] = createReusableTemplate<{ date: DateValue }>();

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DefineMonthTemplate #default="{ date }">
    <div class="**:data-[slot=native-select-icon]:right-1">
      <div class="relative">
        <div class="pointer-events-none absolute inset-0 flex h-full items-center pl-2 text-sm">
          {{ formatter.custom(toDate(date), { month: 'short' }) }}
        </div>
        <NativeSelect
          class="relative h-8 pr-6 pl-2 text-xs text-transparent"
          :model-value="date.month"
          @update:model-value="showMonth"
        >
          <NativeSelectOption v-for="(month) in createYear({ dateObj: date })" :key="month.toString()" :value="month.month" :selected="date.month === month.month">
            {{ formatter.custom(toDate(month), { month: 'short' }) }}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  </DefineMonthTemplate>

  <DefineYearTemplate #default="{ date }">
    <div class="**:data-[slot=native-select-icon]:right-1">
      <div class="relative">
        <div class="pointer-events-none absolute inset-0 flex h-full items-center pl-2 text-sm">
          {{ formatter.custom(toDate(date), { year: 'numeric' }) }}
        </div>
        <NativeSelect
          class="relative h-8 pr-6 pl-2 text-xs text-transparent"
          :model-value="date.year"
          @update:model-value="showYear"
        >
          <NativeSelectOption v-for="(year) in yearRange" :key="year.toString()" :value="year.year" :selected="date.year === year.year">
            {{ formatter.custom(toDate(year), { year: 'numeric' }) }}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  </DefineYearTemplate>

  <CalendarRoot
    #default="{ grid, weekDays, date }"
    v-bind="forwarded"
    v-model:placeholder="placeholder"
    :locale="localeCode"
    data-slot="calendar"
    :class="cn('bg-field p-3 text-field-foreground', props.class)"
  >
    <CalendarHeader class="pt-0">
      <nav class="absolute inset-x-0 top-0 flex items-center justify-between gap-1">
        <CalendarPrevButton>
          <slot name="calendar-prev-icon" />
        </CalendarPrevButton>
        <CalendarNextButton>
          <slot name="calendar-next-icon" />
        </CalendarNextButton>
      </nav>

      <slot name="calendar-heading" :date="date" :month="ReuseMonthTemplate" :year="ReuseYearTemplate">
        <template v-if="layout === 'month-and-year'">
          <div class="flex items-center justify-center gap-1">
            <ReuseMonthTemplate :date="date" />
            <ReuseYearTemplate :date="date" />
          </div>
        </template>
        <template v-else-if="layout === 'month-only'">
          <div class="flex items-center justify-center gap-1">
            <ReuseMonthTemplate :date="date" />
            {{ formatter.custom(toDate(date), { year: 'numeric' }) }}
          </div>
        </template>
        <template v-else-if="layout === 'year-only'">
          <div class="flex items-center justify-center gap-1">
            {{ formatter.custom(toDate(date), { month: 'short' }) }}
            <ReuseYearTemplate :date="date" />
          </div>
        </template>
        <template v-else>
          <CalendarHeading />
        </template>
      </slot>
    </CalendarHeader>

    <div class="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
