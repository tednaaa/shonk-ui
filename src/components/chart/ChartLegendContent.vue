<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils';
import { useChart } from './context';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { config } = useChart();
</script>

<template>
  <div
    data-slot="chart-legend"
    :class="cn('flex flex-wrap items-center justify-center gap-4 pt-3', props.class)"
  >
    <div
      v-for="(item, key) in config"
      :key="key"
      class="flex items-center gap-1.5"
    >
      <component :is="item.icon" v-if="item.icon" class="size-3 text-muted-foreground" />
      <div
        v-else
        class="size-2 shrink-0 rounded-[2px] bg-(--legend-color)"
        :style="{ '--legend-color': `var(--chart-${key})` }"
      />
      {{ item.label ?? key }}
    </div>
  </div>
</template>
