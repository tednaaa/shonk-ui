<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { Primitive } from 'reka-ui';
import { cn } from '@/utils';
import { sidebarMenuSubButtonVariants } from './variants';

const props = withDefaults(defineProps<PrimitiveProps & {
  size?: 'sm' | 'md';
  isActive?: boolean;
  class?: HTMLAttributes['class'];
}>(), {
  as: 'a',
  size: 'md',
});
</script>

<template>
  <Primitive
    data-slot="sidebar-menu-sub-button"
    data-sidebar="menu-sub-button"
    :as="as"
    :as-child="asChild"
    :data-size="size"
    :data-active="isActive"
    :class="cn(sidebarMenuSubButtonVariants({ size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
