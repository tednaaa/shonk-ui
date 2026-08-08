<script setup lang="ts">
import type { TagsInputRootEmits, TagsInputRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { TagsInputRoot, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/utils';

const props = defineProps<TagsInputRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<TagsInputRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <TagsInputRoot
    #default="slotProps"
    v-bind="forwarded"
    :class="cn(
      'flex flex-wrap gap-2 items-center rounded-md border border-border-default bg-bg-surface px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
      'focus-within:border-border-focus focus-within:ring-border-focus/50 focus-within:ring-3',
      'aria-invalid:ring-border-danger/20 dark:aria-invalid:ring-border-danger/40 aria-invalid:border-border-danger',
      props.class)"
  >
    <slot v-bind="slotProps" />
  </TagsInputRoot>
</template>
