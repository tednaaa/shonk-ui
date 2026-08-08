<script lang="ts" setup>
import type { StepperDescriptionProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { StepperDescription, useForwardProps } from 'reka-ui';
import { cn } from '@/utils';

const props = defineProps<StepperDescriptionProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <StepperDescription #default="slotProps" v-bind="forwarded" :class="cn('text-xs text-text-tertiary', props.class)">
    <slot v-bind="slotProps" />
  </StepperDescription>
</template>
