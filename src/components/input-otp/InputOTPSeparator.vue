<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { MinusIcon } from '@lucide/vue';
import { cn } from '@/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <div
    role="separator"
    data-slot="input-otp-separator"
    :class="cn('flex items-center text-muted-foreground [&_svg:not([class*=size-])]:size-4', props.class)"
  >
    <slot>
      <MinusIcon />
    </slot>
  </div>
</template>
