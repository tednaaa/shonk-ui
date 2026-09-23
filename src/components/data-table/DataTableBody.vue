<script setup lang="ts" generic="TData extends object">
import type { HTMLAttributes } from 'vue';
import type { KitTable } from './lib/features';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Spinner } from '../spinner';
import { TableBody, TableCell, TableEmpty, TableRow } from '../table';
import DataTableRow from './DataTableRow.vue';
import { injectDataTableRowPinning } from './lib/rowPinning';

const props = defineProps<{
  table: KitTable<TData>;
  rowClass?: (row: TData) => HTMLAttributes['class'];
  emptyText?: string;
  loading?: boolean;
  loadingMore?: boolean;
  onRowClick?: (row: TData) => void;
}>();

const locale = useLocale();

const pinnedRowsInsets = injectDataTableRowPinning();

const topRows = computed(() => props.table.getTopRows());
const centerRows = computed(() => props.table.getCenterRows());
const bottomRows = computed(() => props.table.getBottomRows());
const hasRows = computed(() => topRows.value.length + centerRows.value.length + bottomRows.value.length > 0);
const visibleColumnCount = computed(() => props.table.getVisibleLeafColumns().length);

const topRowsClass = 'shadow-[0_6px_8px_-6px_rgb(0_0_0/0.25)] dark:shadow-[0_6px_10px_-6px_rgb(0_0_0/0.8)] [&>tr>td]:pb-[calc(--spacing(2)+1px)] [&>tr>td]:shadow-[inset_0_-1px_0_var(--border)]';

const bottomRowsClass = 'shadow-[0_-6px_8px_-6px_rgb(0_0_0/0.25)] dark:shadow-[0_-6px_10px_-6px_rgb(0_0_0/0.8)] [&>tr>td]:pt-[calc(--spacing(2)+1px)] [&>tr>td]:shadow-[inset_0_1px_0_var(--border)]';

const pinnedRowsClass = computed(() => cn(
  'sticky z-2 bg-background [&>tr]:border-b-0',
  props.loading && 'pointer-events-none [&>tr]:opacity-50',
));
</script>

<template>
  <TableBody
    v-if="topRows.length > 0"
    :class="cn(pinnedRowsClass, topRowsClass)"
    :style="{ top: `${pinnedRowsInsets.top}px` }"
  >
    <DataTableRow
      v-for="row in topRows"
      :key="row.id"
      :row="row"
      :row-class="rowClass"
      :on-row-click="onRowClick"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="context"
      >
        <slot
          :name="name"
          v-bind="context"
        />
      </template>
    </DataTableRow>
  </TableBody>

  <TableBody :class="cn('transition-opacity', loading && hasRows && 'pointer-events-none opacity-50')">
    <DataTableRow
      v-for="row in centerRows"
      :key="row.id"
      :row="row"
      :row-class="rowClass"
      :on-row-click="onRowClick"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="context"
      >
        <slot
          :name="name"
          v-bind="context"
        />
      </template>
    </DataTableRow>

    <TableEmpty
      v-if="!hasRows"
      :colspan="visibleColumnCount"
    >
      <Spinner v-if="loading" />
      <slot
        v-else
        name="empty"
      >
        {{ emptyText ?? locale.dataTable.emptyText }}
      </slot>
    </TableEmpty>

    <TableRow v-else-if="loadingMore">
      <TableCell
        :colspan="visibleColumnCount"
        class="py-4"
      >
        <Spinner class="mx-auto" />
      </TableCell>
    </TableRow>
  </TableBody>

  <TableBody
    v-if="bottomRows.length > 0"
    :class="cn(pinnedRowsClass, bottomRowsClass)"
    :style="{ bottom: `${pinnedRowsInsets.bottom}px` }"
  >
    <DataTableRow
      v-for="row in bottomRows"
      :key="row.id"
      :row="row"
      :row-class="rowClass"
      :on-row-click="onRowClick"
    >
      <template
        v-for="(_, name) in $slots"
        #[name]="context"
      >
        <slot
          :name="name"
          v-bind="context"
        />
      </template>
    </DataTableRow>
  </TableBody>
</template>
