<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div
    data-slot="dialog-body"
    :class="cn('-mx-6 px-6 py-5 scrollbar-thin [scrollbar-color:var(--color-border-strong)_transparent]', props.class)"
  >
    <slot />
  </div>
</template>
