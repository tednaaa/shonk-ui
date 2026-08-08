<script setup lang="ts">
import type { SelectTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { ChevronDown, X } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { injectSelectRootContext, SelectIcon, SelectTrigger, useForwardProps } from 'reka-ui';
import { computed } from 'vue';
import { cn } from '@/utils';

const props = defineProps<SelectTriggerProps & {
  class?: HTMLAttributes['class'];
  size?: 'sm' | 'md';
  clearable?: boolean;
}>();

const delegatedProps = reactiveOmit(props, 'class', 'size', 'clearable');
const forwardedProps = useForwardProps(delegatedProps);

const rootContext = injectSelectRootContext();

const hasValue = computed(() => {
  const value = rootContext.modelValue?.value;
  return Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined;
});

const showClear = computed(
  () => props.clearable && hasValue.value && !rootContext.disabled?.value && !props.disabled,
);

function clear() {
  rootContext.modelValue.value = Array.isArray(rootContext.modelValue.value) ? [] : undefined;
}
</script>

<template>
  <div :class="cn('relative w-fit', props.class)">
    <SelectTrigger
      data-slot="select-trigger"
      :data-size="size"
      v-bind="forwardedProps"
      :class="cn(
        'border-border-default data-placeholder:text-text-tertiary [&_svg:not([class*=\'text-\'])]:text-text-tertiary focus-visible:border-border-focus focus-visible:ring-border-focus/50 aria-invalid:ring-border-danger/20 dark:aria-invalid:ring-border-danger/40 aria-invalid:border-border-danger flex w-full items-center justify-between gap-2 rounded-sm border bg-bg-surface px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=md]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        showClear && 'pr-16',
      )"
    >
      <slot />
      <SelectIcon as-child>
        <ChevronDown :class="cn('size-4 opacity-50', showClear && 'absolute top-1/2 right-3 -translate-y-1/2')" />
      </SelectIcon>
    </SelectTrigger>

    <button
      v-if="showClear"
      type="button"
      aria-label="Clear selection"
      tabindex="-1"
      class="cursor-pointer text-text-tertiary hover:text-text-primary absolute top-1/2 right-8 -translate-y-1/2 rounded-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-border-focus/50"
      @pointerdown.stop.prevent="clear"
    >
      <X class="size-4" />
    </button>
  </div>
</template>
