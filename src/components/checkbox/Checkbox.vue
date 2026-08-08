<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { CheckIcon, MinusIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/utils';

export interface CheckboxProps extends CheckboxRootProps {
  class?: HTMLAttributes['class'];
}

const props = defineProps<CheckboxProps>();
const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <CheckboxRoot
    #default="slotProps"
    data-slot="checkbox"
    v-bind="forwarded"
    :class="cn(
      'peer bg-bg-surface border-border-strong data-[state=checked]:bg-bg-brand data-[state=checked]:text-text-inverse data-[state=checked]:border-border-brand focus-visible:border-border-focus focus-visible:ring-border-focus/50 aria-invalid:ring-border-danger/20 dark:aria-invalid:ring-border-danger/40 aria-invalid:border-border-danger size-4 shrink-0 rounded-[3px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      props.class,
    )"
  >
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current transition-none"
    >
      <slot v-bind="slotProps">
        <MinusIcon v-if="slotProps.state === 'indeterminate'" class="size-3.5" />
        <CheckIcon v-else class="size-3.5" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
