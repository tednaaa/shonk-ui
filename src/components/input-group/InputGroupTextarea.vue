<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';
import { Textarea } from '../textarea';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const modelValue = defineModel<string | number>({ required: true });
</script>

<template>
  <Textarea
    v-model="modelValue"
    data-slot="input-group-control"
    :class="cn(
      'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
      props.class,
    )"
  />
</template>
