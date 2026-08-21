<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';
import { useLocale } from '@/locales';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  ariaLabel?: string;
}>();

const locale = useLocale();
</script>

<template>
  <nav
    :aria-label="props.ariaLabel ?? locale.breadcrumb.navAriaLabel"
    data-slot="breadcrumb"
    :class="props.class"
  >
    <slot />
  </nav>
</template>
