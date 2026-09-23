<script setup lang="ts" generic="TData extends object">
import type { KitTable } from './lib/features';
import { FlexRender } from '@tanstack/vue-table';
import { computed, useTemplateRef } from 'vue';
import { cn } from '@/utils';
import { TableCell, TableFooter, TableRow } from '../table';
import { injectDataTableColumnPinning } from './lib/columnPinning';
import { getDisplayedRows, usePinnedRowsInset } from './lib/rowPinning';

const props = defineProps<{
  table: KitTable<TData>;
}>();

const { pinnedCellAttrs } = injectDataTableColumnPinning();

const leafHeaders = computed(() => props.table.getFooterGroups()[0]?.headers ?? []);

usePinnedRowsInset('bottom', useTemplateRef('footer'));

const visible = computed(() => getDisplayedRows(props.table).length > 0
  && leafHeaders.value.some(header => header.column.columnDef.footer !== undefined));
</script>

<template>
  <TableFooter
    v-if="visible"
    ref="footer"
    class="sticky bottom-0 z-10 border-t-0 bg-background"
  >
    <TableRow>
      <TableCell
        v-for="header in leafHeaders"
        :key="header.id"
        v-bind="pinnedCellAttrs([header.column.id])"
        :class="cn('shadow-[inset_0_1px_0_var(--border)]', header.column.columnDef.meta?.class)"
      >
        <FlexRender :footer="header" />
      </TableCell>
    </TableRow>
  </TableFooter>
</template>
