import type { MaybeRefOrGetter, Ref } from 'vue';
import type { DataTableColumn, DataTableInstance, DataTablePaginationState, DataTableSortingState } from './types';
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
  totalRowCount?: MaybeRefOrGetter<number>;
  sorting?: Ref<DataTableSortingState>;
  enableMultiSort?: boolean;
  pagination?: Ref<DataTablePaginationState>;
}

export function useDataTable<TData extends object>(options: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const { totalRowCount } = options;
  const serverSide = options.serverSide ?? false;
  const sorting = options.sorting ?? ref<DataTableSortingState>([]);
  const pagination = options.pagination ?? ref<DataTablePaginationState>({ pageIndex: 0, pageSize: Infinity });

  function goToFirstPage() {
    if (pagination.value.pageIndex !== 0)
      pagination.value = { ...pagination.value, pageIndex: 0 };
  }

  const table = useTable({
    features,
    data: computed(() => toValue(options.data)),
    columns: computed(() => toColumnDefs(toValue(options.columns))),
    getRowId: options.getRowId,
    state: computed(() => ({ sorting: sorting.value, pagination: pagination.value })),
    onSortingChange: (updater) => {
      sorting.value = functionalUpdate(updater, sorting.value);
      goToFirstPage();
    },
    onPaginationChange: (updater) => {
      pagination.value = functionalUpdate(updater, pagination.value);
    },
    manualSorting: serverSide,
    manualPagination: serverSide,
    rowCount: totalRowCount === undefined ? undefined : computed(() => toValue(totalRowCount)),
    enableMultiSort: options.enableMultiSort ?? false,
    sortDescFirst: false,
  });

  return createDataTableInstance(table);
}
