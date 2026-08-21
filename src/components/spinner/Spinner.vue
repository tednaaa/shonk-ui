<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { Loader2Icon } from '@lucide/vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  ariaLabel?: string;
}>();

const locale = useLocale();
</script>

<template>
  <Loader2Icon
    role="status"
    :aria-label="props.ariaLabel ?? locale.spinner.ariaLabel"
    :class="cn('size-4 animate-spin', props.class)"
  />
</template>
