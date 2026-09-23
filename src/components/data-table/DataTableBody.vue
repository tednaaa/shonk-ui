<script setup lang="ts" generic="TData extends object">
import type { HTMLAttributes } from 'vue';
import type { KitTable } from './lib/features';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Spinner } from '../spinner';
import { TableBody, TableEmpty } from '../table';
import DataTableRow from './DataTableRow.vue';

const props = defineProps<{
  table: KitTable<TData>;
  rowClass?: (row: TData) => HTMLAttributes['class'];
  emptyText?: string;
  loading?: boolean;
  onRowClick?: (row: TData) => void;
}>();

const locale = useLocale();

const rows = computed(() => props.table.getRowModel().rows);
const visibleColumnCount = computed(() => props.table.getVisibleLeafColumns().length);
</script>

<template>
  <TableBody :class="cn('transition-opacity', loading && rows.length > 0 && 'pointer-events-none opacity-50')">
    <DataTableRow
      v-for="row in rows"
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
      v-if="rows.length === 0"
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
  </TableBody>
</template>
