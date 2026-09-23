<script setup lang="ts">
import type { ProgressRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { computed } from 'vue';
import { cn } from '@/utils';

const props = withDefaults(defineProps<
  ProgressRootProps & { class?: HTMLAttributes['class'] }
>(), {
  modelValue: 0,
  max: 100,
});

const delegatedProps = reactiveOmit(props, 'class');

const filledPercent = computed(() => {
  const ratio = (props.modelValue ?? 0) / props.max;

  return Math.min(Math.max(ratio, 0), 1) * 100;
});
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="
      cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-muted',
        props.class,
      )
    "
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      class="size-full flex-1 bg-primary transition-transform"
      :style="{ transform: `translateX(-${100 - filledPercent}%)` }"
    />
  </ProgressRoot>
</template>
