<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationRoot, useForwardPropsEmits } from 'reka-ui';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = defineProps<PaginationRootProps & {
  class?: HTMLAttributes['class'];
}>();
const emits = defineEmits<PaginationRootEmits>();

const locale = useLocale();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PaginationRoot
    #default="slotProps"
    data-slot="pagination"
    v-bind="forwarded"
    :aria-label="locale.pagination.navAriaLabel"
    :class="cn('mx-auto flex w-full justify-center', props.class)"
  >
    <slot v-bind="slotProps" />
  </PaginationRoot>
</template>
