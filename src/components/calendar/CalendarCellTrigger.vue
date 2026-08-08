<script lang="ts" setup>
import type { CalendarCellTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { CalendarCellTrigger, useForwardProps } from 'reka-ui';
import { cn } from '@/utils';
import { buttonVariants } from '../button';

const props = withDefaults(defineProps<CalendarCellTriggerProps & { class?: HTMLAttributes['class'] }>(), {
  as: 'button',
});

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <CalendarCellTrigger
    data-slot="calendar-cell-trigger"
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'size-8 p-0 font-normal aria-selected:opacity-100 cursor-default',
      '[&[data-today]:not([data-selected])]:bg-bg-brand-subtle [&[data-today]:not([data-selected])]:text-text-brand',
      // Selected
      'data-[selected]:bg-bg-brand data-[selected]:text-text-inverse data-[selected]:opacity-100 [&[data-selected]:hover]:bg-bg-brand data-[selected]:hover:text-text-inverse data-[selected]:focus:bg-bg-brand data-[selected]:focus:text-text-inverse',
      // Disabled
      'data-[disabled]:text-text-tertiary data-[disabled]:opacity-50',
      // Unavailable
      'data-[unavailable]:text-text-inverse data-[unavailable]:line-through',
      // Outside months
      'data-[outside-view]:text-text-tertiary',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
