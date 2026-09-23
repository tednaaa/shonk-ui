<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

export interface InputProps {
  defaultValue?: string | number;
  class?: HTMLAttributes['class'];
  invalid?: boolean;
}

const props = defineProps<InputProps>();

const modelValue = defineModel<string | number>({
  default: (rawProps: InputProps) => rawProps.defaultValue ?? '',
});
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(
      'h-10 w-full min-w-0 rounded-md border border-border bg-background px-3 py-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground read-only:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      props.class,
    )"
    :aria-invalid="invalid || undefined"
  >
</template>
