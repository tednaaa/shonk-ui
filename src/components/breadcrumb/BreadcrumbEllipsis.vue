<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { MoreHorizontal } from '@lucide/vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  screenReaderText?: string;
}>();

const locale = useLocale();
</script>

<template>
  <span
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    aria-hidden="true"
    :class="cn('flex size-9 items-center justify-center', props.class)"
  >
    <slot>
      <MoreHorizontal class="size-4" />
    </slot>
    <span class="sr-only">{{ props.screenReaderText ?? locale.breadcrumb.ellipsisScreenReaderText }}</span>
  </span>
</template>
