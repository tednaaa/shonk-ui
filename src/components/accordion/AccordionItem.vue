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
    :class="cn('bg-background data-[state=open]:text-foreground data-[state=closed]:text-muted-foreground overflow-hidden rounded-lg border border-input shadow-sm', props.class)"
  >
    <slot v-bind="slotProps" />
  </AccordionItem>
</template>
