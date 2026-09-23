<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <tr
    data-slot="table-row"
    :class="cn('border-b transition-colors data-[state=selected]:bg-muted', props.class)"
  >
    <slot />
  </tr>
</template>
