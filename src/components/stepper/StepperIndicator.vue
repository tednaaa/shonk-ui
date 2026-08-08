<script lang="ts" setup>
import type { StepperIndicatorProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { StepperIndicator, useForwardProps } from 'reka-ui';
import { cn } from '@/utils';

const props = defineProps<StepperIndicatorProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <StepperIndicator
    #default="slotProps"
    v-bind="forwarded"
    :class="cn(
      'inline-flex items-center justify-center rounded-full text-text-tertiary/50 w-8 h-8',
      // Disabled
      'group-data-[disabled]:text-text-tertiary group-data-[disabled]:opacity-50',
      // Active
      'group-data-[state=active]:bg-bg-brand group-data-[state=active]:text-text-inverse',
      // Completed
      'group-data-[state=completed]:bg-bg-brand-subtle group-data-[state=completed]:text-text-brand',
      props.class,
    )"
  >
    <slot v-bind="slotProps" />
  </StepperIndicator>
</template>
