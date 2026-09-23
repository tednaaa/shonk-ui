import type { MaybeRefOrGetter } from 'vue';
import type { DataTableColumn, DataTableInstance } from './types';
import { useTable } from '@tanstack/vue-table';
import { computed, toValue } from 'vue';
import { features } from './lib/features';
import { createDataTableInstance } from './lib/instance';
import { toColumnDefs } from './lib/toColumnDefs';

export interface UseDataTableOptions<TData extends object> {
  data: MaybeRefOrGetter<readonly TData[]>;
  columns: MaybeRefOrGetter<readonly DataTableColumn<TData>[]>;
  getRowId?: (row: TData, index: number) => string;
}

export function useDataTable<TData extends object>(options: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const table = useTable({
    features,
    data: computed(() => toValue(options.data)),
    columns: computed(() => toColumnDefs(toValue(options.columns))),
    getRowId: options.getRowId,
  });

  return createDataTableInstance(table);
}
