<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const modelValue = defineModel<string | number>({ required: true });
</script>

<template>
  <textarea
    v-model="modelValue"
    data-slot="textarea"
    :class="cn('border-border-default placeholder:text-text-tertiary focus-visible:border-border-focus focus-visible:ring-border-focus/50 aria-invalid:ring-border-danger/20 dark:aria-invalid:ring-border-danger/40 aria-invalid:border-border-danger flex field-sizing-content min-h-16 w-full rounded-md border bg-bg-surface px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', props.class)"
  />
</template>
