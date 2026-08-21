<script setup lang="ts">
import type { PaginationEllipsisProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { MoreHorizontal } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationEllipsis } from 'reka-ui';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = defineProps<PaginationEllipsisProps & {
  class?: HTMLAttributes['class'];
  screenReaderText?: string;
}>();

const locale = useLocale();

const delegatedProps = reactiveOmit(props, 'class', 'screenReaderText');
</script>

<template>
  <PaginationEllipsis
    data-slot="pagination-ellipsis"
    v-bind="delegatedProps"
    :class="cn('flex size-9 items-center justify-center text-text-tertiary', props.class)"
  >
    <slot>
      <MoreHorizontal class="size-4" />
      <span class="sr-only">{{ props.screenReaderText ?? locale.pagination.ellipsisScreenReaderText }}</span>
    </slot>
  </PaginationEllipsis>
</template>
