import type { VueTable } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import {
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/vue-table';

export interface KitColumnMeta {
  class?: HTMLAttributes['class'];
  headerClass?: HTMLAttributes['class'];
}

export const features = tableFeatures({
  columnVisibilityFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime, text: sortFn_text },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  columnMeta: metaHelper<KitColumnMeta>(),
});

export type KitFeatures = typeof features;

export type KitTable<TData extends object> = VueTable<KitFeatures, TData>;
