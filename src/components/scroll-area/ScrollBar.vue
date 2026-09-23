<script setup lang="ts">
import type { ScrollAreaScrollbarProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui';
import { cn } from '@/utils';
import { scrollBarVariants } from './variants';

const props = withDefaults(defineProps<ScrollAreaScrollbarProps & { class?: HTMLAttributes['class'] }>(), {
  orientation: 'vertical',
});

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <ScrollAreaScrollbar
    data-slot="scroll-area-scrollbar"
    v-bind="delegatedProps"
    :class="cn(scrollBarVariants({ orientation }), props.class)"
  >
    <ScrollAreaThumb
      data-slot="scroll-area-thumb"
      class="relative flex-1 rounded-full bg-input"
    />
  </ScrollAreaScrollbar>
</template>
