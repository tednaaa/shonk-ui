<script setup lang="ts">
import type { PaginationPrevProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '@/components/button';
import { ChevronLeftIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationPrev, useForwardProps } from 'reka-ui';
import { buttonVariants } from '@/components/button';
import { cn } from '@/utils';

const props = withDefaults(defineProps<PaginationPrevProps & {
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  label?: string;
}>(), {
  size: 'default',
  label: 'Назад',
});

const delegatedProps = reactiveOmit(props, 'class', 'size', 'label');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationPrev
    data-slot="pagination-previous"
    :class="cn(buttonVariants({ variant: 'ghost', size }), 'gap-1 px-2.5 sm:pr-2.5', props.class)"
    v-bind="forwarded"
  >
    <slot>
      <ChevronLeftIcon />
      <span class="hidden sm:block">{{ label }}</span>
    </slot>
  </PaginationPrev>
</template>
