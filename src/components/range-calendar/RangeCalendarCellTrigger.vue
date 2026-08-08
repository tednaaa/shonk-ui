<script lang="ts" setup>
import type { RangeCalendarCellTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { RangeCalendarCellTrigger, useForwardProps } from 'reka-ui';
import { cn } from '@/utils';
import { buttonVariants } from '../button';

const props = withDefaults(defineProps<RangeCalendarCellTriggerProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'button',
});

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <RangeCalendarCellTrigger
    data-slot="range-calendar-trigger"
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'h-8 w-8 p-0 font-normal data-[selected]:opacity-100',
      '[&[data-today]:not([data-selected])]:bg-bg-brand-subtle [&[data-today]:not([data-selected])]:text-text-brand',
      // Selection Start
      'data-[selection-start]:bg-bg-brand data-[selection-start]:text-text-inverse [&[data-selection-start]:hover]:bg-bg-brand data-[selection-start]:hover:text-text-inverse data-[selection-start]:focus:bg-bg-brand data-[selection-start]:focus:text-text-inverse',
      // Selection End
      'data-[selection-end]:bg-bg-brand data-[selection-end]:text-text-inverse [&[data-selection-end]:hover]:bg-bg-brand data-[selection-end]:hover:text-text-inverse data-[selection-end]:focus:bg-bg-brand data-[selection-end]:focus:text-text-inverse',
      // Outside months
      'data-[outside-view]:text-text-tertiary',
      // Disabled
      'data-[disabled]:text-text-tertiary data-[disabled]:opacity-50',
      // Unavailable
      'data-[unavailable]:text-text-inverse data-[unavailable]:line-through',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarCellTrigger>
</template>
