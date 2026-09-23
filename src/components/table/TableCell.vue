<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <td
    data-slot="table-cell"
    :class="
      cn(
        'p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 has-[>[role=switch]]:leading-none *:[[role=checkbox]]:translate-y-[2px] *:[[role=switch]]:align-middle',
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>
