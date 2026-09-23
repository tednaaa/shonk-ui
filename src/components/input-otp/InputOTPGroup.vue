<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <div
    data-slot="input-otp-group"
    :class="cn('flex items-center', props.class)"
  >
    <slot />
  </div>
</template>
