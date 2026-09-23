import type { MaybeRefOrGetter, Ref } from 'vue';
import type { DataTableColumn, DataTableInstance, DataTableSortingState } from './types';
import { functionalUpdate, useTable } from '@tanstack/vue-table';
import { computed, ref, toValue } from 'vue';
import { features } from './lib/features';
import { createDataTableInstance } from './lib/instance';
import { toColumnDefs } from './lib/toColumnDefs';

export interface UseDataTableOptions<TData extends object> {
  data: MaybeRefOrGetter<readonly TData[]>;
  columns: MaybeRefOrGetter<readonly DataTableColumn<TData>[]>;
  getRowId?: (row: TData, index: number) => string;
  serverSide?: boolean;
  sorting?: Ref<DataTableSortingState>;
  enableMultiSort?: boolean;
}

export function useDataTable<TData extends object>(options: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const sorting = options.sorting ?? ref<DataTableSortingState>([]);

  const table = useTable({
    features,
    data: computed(() => toValue(options.data)),
    columns: computed(() => toColumnDefs(toValue(options.columns))),
    getRowId: options.getRowId,
    state: computed(() => ({ sorting: sorting.value })),
    onSortingChange: (updater) => {
      sorting.value = functionalUpdate(updater, sorting.value);
    },
    manualSorting: options.serverSide ?? false,
    enableMultiSort: options.enableMultiSort ?? false,
    sortDescFirst: false,
  });

  return createDataTableInstance(table);
}
