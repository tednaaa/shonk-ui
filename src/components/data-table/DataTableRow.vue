<script setup lang="ts" generic="TData extends object">
import type { Row } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import type { KitFeatures } from './lib/features';
import { FlexRender } from '@tanstack/vue-table';
import { cn } from '@/utils';
import { TableCell, TableRow } from '../table';
import { isInteractiveClick } from './lib/isInteractiveClick';

const props = defineProps<{
  row: Row<KitFeatures, TData>;
  rowClass?: (row: TData) => HTMLAttributes['class'];
  onRowClick?: (row: TData) => void;
}>();

function handleClick(event: MouseEvent) {
  if (!props.onRowClick || isInteractiveClick(event))
    return;

  props.onRowClick(props.row.original);
}
</script>

<template>
  <TableRow
    :class="cn(onRowClick && 'cursor-pointer', rowClass?.(row.original))"
    @click="handleClick"
  >
    <TableCell
      v-for="cell in row.getVisibleCells()"
      :key="cell.id"
      :class="cell.column.columnDef.meta?.class"
    >
      <slot
        :name="`cell-${cell.column.id}`"
        :row="row.original"
        :value="cell.getValue()"
      >
        <FlexRender :cell="cell" />
      </slot>
    </TableCell>
  </TableRow>
</template>
