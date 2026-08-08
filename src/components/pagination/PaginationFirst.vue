<script setup lang="ts">
import type { PaginationFirstProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '@/components/button';
import { ChevronLeftIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationFirst, useForwardProps } from 'reka-ui';
import { buttonVariants } from '@/components/button';
import { cn } from '@/utils';

const props = withDefaults(defineProps<PaginationFirstProps & {
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  label?: string;
}>(), {
  size: 'default',
  label: 'Первая',
});

const delegatedProps = reactiveOmit(props, 'class', 'size', 'label');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationFirst
    data-slot="pagination-first"
    :class="cn(buttonVariants({ variant: 'ghost', size }), 'gap-1 px-2.5 sm:pr-2.5', props.class)"
    v-bind="forwarded"
  >
    <slot>
      <ChevronLeftIcon />
      <span class="hidden sm:block">{{ label }}</span>
    </slot>
  </PaginationFirst>
</template>
