<script setup lang="ts" generic="TData extends object">
import type { Header } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { cn } from '@/utils';
import { injectDataTableColumnSizing } from './lib/columnSizing';

const props = defineProps<{
  header: Header<KitFeatures, TData, unknown>;
}>();

const emit = defineEmits<{
  resizeStart: [];
}>();

const { startResize } = injectDataTableColumnSizing();

function handleResizeStart(event: MouseEvent | TouchEvent) {
  emit('resizeStart');
  startResize(event, props.header.getResizeHandler());
}
</script>

<template>
  <div
    data-slot="data-table-resize-handle"
    aria-hidden="true"
    :class="cn('absolute inset-y-0 inset-e-0 z-1 w-1 cursor-col-resize touch-none hover:bg-ring', header.column.getIsResizing() && 'bg-ring')"
    @mousedown.stop.prevent="handleResizeStart"
    @touchstart.stop.passive="handleResizeStart"
    @dblclick="header.column.resetSize()"
  />
</template>
