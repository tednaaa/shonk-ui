<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { ChevronDownIcon } from '@lucide/vue';
import { cn } from '@/utils';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const modelValue = defineModel<AcceptableValue | AcceptableValue[]>({ default: '' });
</script>

<template>
  <div
    class="group/native-select relative w-fit has-[select:disabled]:opacity-50"
    data-slot="native-select-wrapper"
  >
    <select
      v-bind="$attrs"
      v-model="modelValue"
      data-slot="native-select"
      :class="cn(
        'h-10 w-full min-w-0 appearance-none rounded-md border border-border bg-field px-3 py-2 pr-9 text-sm text-field-foreground shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive-ring',
        props.class,
      )"
    >
      <slot />
    </select>
    <ChevronDownIcon
      class="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground opacity-50 select-none"
      aria-hidden="true"
      data-slot="native-select-icon"
    />
  </div>
</template>
