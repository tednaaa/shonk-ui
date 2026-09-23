import type { VueTable } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import {
  cellSpanningFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  metaHelper,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/vue-table';

export interface KitColumnMeta {
  label?: string;
  class?: HTMLAttributes['class'];
  headerClass?: HTMLAttributes['class'];
}

export const features = tableFeatures({
  columnVisibilityFeature,
  columnPinningFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime, text: sortFn_text },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowSelectionFeature,
  rowExpandingFeature,
  rowPinningFeature,
  cellSpanningFeature,
  columnMeta: metaHelper<KitColumnMeta>(),
});

export type KitFeatures = typeof features;

export type KitTable<TData extends object> = VueTable<KitFeatures, TData>;
