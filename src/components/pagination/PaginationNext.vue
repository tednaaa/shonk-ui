<script setup lang="ts">
import type { PaginationNextProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '@/components/button';
import { ChevronRightIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationNext, useForwardProps } from 'reka-ui';
import { buttonVariants } from '@/components/button';
import { cn } from '@/utils';

const props = withDefaults(defineProps<PaginationNextProps & {
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  label?: string;
}>(), {
  size: 'default',
  label: 'Вперёд',
});

const delegatedProps = reactiveOmit(props, 'class', 'size', 'label');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationNext
    data-slot="pagination-next"
    :class="cn(buttonVariants({ variant: 'ghost', size }), 'gap-1 px-2.5 sm:pr-2.5', props.class)"
    v-bind="forwarded"
  >
    <slot>
      <span class="hidden sm:block">{{ label }}</span>
      <ChevronRightIcon />
    </slot>
  </PaginationNext>
</template>
