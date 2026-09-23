<script setup lang="ts">
import type { PaginationListItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ButtonVariants } from '@/components/button';
import { reactiveOmit } from '@vueuse/core';
import { PaginationListItem } from 'reka-ui';
import { buttonVariants } from '@/components/button';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = withDefaults(defineProps<PaginationListItemProps & {
  size?: ButtonVariants['size'];
  class?: HTMLAttributes['class'];
  isActive?: boolean;
}>(), {
  size: 'icon',
});

const locale = useLocale();

const delegatedProps = reactiveOmit(props, 'class', 'size', 'isActive');
</script>

<template>
  <PaginationListItem
    data-slot="pagination-item"
    v-bind="delegatedProps"
    :aria-label="locale.pagination.pageButtonAriaLabel(value)"
    :class="cn(
      buttonVariants({
        variant: isActive ? 'secondary' : 'ghost',
        size,
      }),
      props.class)"
  >
    <slot />
  </PaginationListItem>
</template>
