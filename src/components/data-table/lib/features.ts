import type { VueTable } from '@tanstack/vue-table';
import type { HTMLAttributes } from 'vue';
import { columnVisibilityFeature, metaHelper, tableFeatures } from '@tanstack/vue-table';

export interface KitColumnMeta {
  class?: HTMLAttributes['class'];
  headerClass?: HTMLAttributes['class'];
}

export const features = tableFeatures({
  columnVisibilityFeature,
  columnMeta: metaHelper<KitColumnMeta>(),
});

export type KitFeatures = typeof features;

export type KitTable<TData extends object> = VueTable<KitFeatures, TData>;
