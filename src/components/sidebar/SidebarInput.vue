<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';
import { Input } from '../input';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <Input
    data-slot="sidebar-input"
    data-sidebar="input"
    :class="cn(
      'h-8 w-full bg-background shadow-none',
      props.class,
    )"
  >
    <slot />
  </Input>
</template>
