<script setup lang="ts">
import type { PaginationFirstProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '@/components/button';
import { ChevronsLeftIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationFirst, useForwardProps } from 'reka-ui';
import { computed } from 'vue';
import { buttonVariants } from '@/components/button';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = withDefaults(defineProps<PaginationFirstProps & {
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  buttonText?: string;
}>(), {
  size: 'default',
});

const locale = useLocale();

const resolvedButtonText = computed(() => props.buttonText ?? locale.value.pagination.firstButtonText);

const delegatedProps = reactiveOmit(props, 'class', 'size', 'buttonText');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationFirst
    data-slot="pagination-first"
    :class="cn(buttonVariants({ variant: 'ghost', size }), 'gap-1 px-2.5 sm:pr-2.5', props.class)"
    v-bind="forwarded"
    :aria-label="resolvedButtonText"
  >
    <slot>
      <ChevronsLeftIcon />
      <span class="hidden sm:block">{{ resolvedButtonText }}</span>
    </slot>
  </PaginationFirst>
</template>
