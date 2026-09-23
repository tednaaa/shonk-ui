<script setup lang="ts" generic="TData extends object">
import type { Row } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import type { KitFeatures } from './lib/features';
import { FlexRender } from '@tanstack/vue-table';
import { cn } from '@/utils';
import { TableCell, TableRow } from '../table';
import { injectDataTableColumnPinning } from './lib/columnPinning';
import { isInteractiveClick } from './lib/isInteractiveClick';

const props = defineProps<{
  row: Row<KitFeatures, TData>;
  rowClass?: (row: TData) => HTMLAttributes['class'];
  onRowClick?: (row: TData) => void;
}>();

const { pinnedCellAttrs } = injectDataTableColumnPinning();

function handleClick(event: MouseEvent) {
  if (!props.onRowClick || isInteractiveClick(event))
    return;

  props.onRowClick(props.row.original);
}
</script>

<template>
  <TableRow
    :data-state="row.getIsSelected() ? 'selected' : undefined"
    :class="cn(onRowClick && 'cursor-pointer hover:bg-muted/50', rowClass?.(row.original))"
    @click="handleClick"
  >
    <TableCell
      v-for="cell in row.getVisibleCells()"
      :key="cell.id"
      v-bind="pinnedCellAttrs([cell.column.id])"
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

  <TableRow
    v-if="$slots.expanded && row.getIsExpanded() && row.getCanExpand()"
    class="bg-secondary"
  >
    <TableCell
      :colspan="row.getVisibleCells().length"
      class="whitespace-normal"
    >
      <slot
        name="expanded"
        :row="row.original"
      />
    </TableCell>
  </TableRow>
</template>
