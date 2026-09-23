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
    :class="cn('overflow-hidden rounded-lg border border-input bg-background shadow-sm data-[state=closed]:text-muted-foreground data-[state=open]:text-foreground', props.class)"
  >
    <slot v-bind="slotProps" />
  </AccordionItem>
</template>
