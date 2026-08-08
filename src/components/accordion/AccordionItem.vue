<script setup lang="ts">
import type { AccordionItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { AccordionItem, useForwardProps } from 'reka-ui';
import { cn } from '@/utils';

const props = defineProps<AccordionItemProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <AccordionItem
    #default="slotProps"
    data-slot="accordion-item"
    v-bind="forwardedProps"
    :class="cn('bg-bg-surface data-[state=open]:text-text-primary data-[state=closed]:text-text-tertiary overflow-hidden rounded-lg border border-border-strong shadow-sm', props.class)"
  >
    <slot v-bind="slotProps" />
  </AccordionItem>
</template>
