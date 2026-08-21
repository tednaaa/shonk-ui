<script setup lang="ts">
import type { DropdownMenuSubTriggerProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { ChevronRight } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import {
  DropdownMenuSubTrigger,
  useForwardProps,
} from 'reka-ui';
import { cn } from '@/utils';

const props = defineProps<DropdownMenuSubTriggerProps & { class?: HTMLAttributes['class']; inset?: boolean }>();

const delegatedProps = reactiveOmit(props, 'class', 'inset');
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuSubTrigger
    data-slot="dropdown-menu-sub-trigger"
    v-bind="forwardedProps"
    :data-inset="inset ? '' : undefined"
    :class="cn(
      'focus:bg-bg-brand-subtle focus:text-text-brand data-[state=open]:bg-bg-brand-subtle data-[state=open]:text-text-brand relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4 data-[variant=destructive]:*:[svg]:!text-text-danger [&_svg:not([class*=text-])]:text-text-tertiary',
      props.class,
    )"
  >
    <slot />
    <ChevronRight class="ml-auto size-4" />
  </DropdownMenuSubTrigger>
</template>
