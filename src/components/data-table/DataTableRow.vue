<script setup lang="ts" generic="TData extends object">
import type { Cell, Row } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import type { KitFeatures } from './lib/features';
import { FlexRender } from '@tanstack/vue-table';
import { computed } from 'vue';
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

const cells = computed(() => props.row.getVisibleCells().filter(cell => !cell.getIsCovered()));

function rowSpan(cell: Cell<KitFeatures, TData>) {
  const span = cell.getRowSpan();

  return span > 1 ? span : undefined;
}

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
      v-for="cell in cells"
      :key="cell.id"
      v-bind="pinnedCellAttrs([cell.column.id])"
      :rowspan="rowSpan(cell)"
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
