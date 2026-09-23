<script setup lang="ts" generic="TData extends object">
import type { HTMLAttributes, VNodeChild } from 'vue';
import type { DataTableCellContext, DataTableHeaderContext, DataTableInstance } from './types';
import { unrefElement, useInfiniteScroll } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';
import { cn } from '@/utils';
import { Table } from '../table';
import DataTableBody from './DataTableBody.vue';
import DataTableFooter from './DataTableFooter.vue';
import DataTableHeader from './DataTableHeader.vue';
import { useColumnPinning } from './lib/columnPinning';
import { unwrapDataTable } from './lib/instance';

const props = defineProps<{
  table: DataTableInstance<TData>;
  class?: HTMLAttributes['class'];
  rowClass?: (row: TData) => HTMLAttributes['class'];
  emptyText?: string;
  loading?: boolean;
  hasNextPage?: boolean;
  loadingMore?: boolean;
  onRowClick?: (row: TData) => void;
}>();

const emit = defineEmits<{
  loadMore: [];
}>();

const slots = defineSlots<{
  [name: `cell-${string}`]: ((context: DataTableCellContext<TData>) => VNodeChild) | undefined;
  [name: `header-${string}`]: ((context: DataTableHeaderContext) => VNodeChild) | undefined;
  expanded?: (context: { row: TData }) => VNodeChild;
  empty?: () => VNodeChild;
}>();

const kitTable = computed(() => unwrapDataTable(props.table));

useColumnPinning(kitTable);

const scrollTable = useTemplateRef('scrollTable');

useInfiniteScroll(
  () => unrefElement(scrollTable),
  () => emit('loadMore'),
  {
    distance: 100,
    canLoadMore: () => props.hasNextPage && !props.loading && !props.loadingMore,
  },
);
</script>

<template>
  <div
    data-slot="data-table"
    :class="cn('flex min-h-0 flex-col overflow-hidden rounded-sm border', props.class)"
  >
    <Table
      ref="scrollTable"
      table-container-class="min-h-0 flex-1"
      :aria-busy="loading || loadingMore"
    >
      <DataTableHeader :table="kitTable">
        <template
          v-for="(_, name) in slots"
          #[name]="context"
        >
          <slot
            :name="name"
            v-bind="context"
          />
        </template>
      </DataTableHeader>

      <DataTableBody
        :table="kitTable"
        :row-class="rowClass"
        :empty-text="emptyText"
        :loading="loading"
        :loading-more="loadingMore"
        :on-row-click="onRowClick"
      >
        <template
          v-for="(_, name) in slots"
          #[name]="context"
        >
          <slot
            :name="name"
            v-bind="context"
          />
        </template>
      </DataTableBody>

      <DataTableFooter :table="kitTable" />
    </Table>
  </div>
</template>
