<script setup lang="ts">
import type { PaginationEllipsisProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { MoreHorizontal } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationEllipsis } from 'reka-ui';
import { cn } from '@/utils';

const props = withDefaults(defineProps<PaginationEllipsisProps & {
  class?: HTMLAttributes['class'];
  label?: string;
}>(), {
  label: 'Ещё страницы',
});

const delegatedProps = reactiveOmit(props, 'class', 'label');
</script>

<template>
  <PaginationEllipsis
    data-slot="pagination-ellipsis"
    v-bind="delegatedProps"
    :class="cn('flex size-9 items-center justify-center text-text-tertiary', props.class)"
  >
    <slot>
      <MoreHorizontal class="size-4" />
      <span class="sr-only">{{ label }}</span>
    </slot>
  </PaginationEllipsis>
</template>
