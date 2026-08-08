<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';
import { cn } from '@/utils';

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes['class'];
  invalid?: boolean;
}>();

const emits = defineEmits<{
  'update:modelValue': [payload: string | number];
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(
      'file:text-text-primary placeholder:text-text-tertiary selection:bg-bg-brand selection:text-text-inverse border-border-default h-10 w-full min-w-0 rounded-md border bg-bg-surface px-3 py-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 read-only:text-text-tertiary md:text-sm',
      'focus-visible:border-border-focus focus-visible:ring-border-focus/50 focus-visible:ring-[3px]',
      'aria-invalid:ring-border-danger/20 dark:aria-invalid:ring-border-danger/40 aria-invalid:border-border-danger',
      props.class,
    )"
    :aria-invalid="invalid || undefined"
  >
</template>
