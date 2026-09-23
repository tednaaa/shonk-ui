import type { ExpandedState } from '@tanstack/vue-table';
import type { MaybeRefOrGetter, Ref } from 'vue';
import type { DataTableColumn, DataTableColumnVisibilityState, DataTableExpandedState, DataTableInstance, DataTablePaginationState, DataTableRowPinningState, DataTableRowSelectionState, DataTableSortingState } from './types';
import { functionalUpdate, useTable } from '@tanstack/vue-table';
import { computed, ref, toValue } from 'vue';
import { features } from './lib/features';
import { createDataTableInstance } from './lib/instance';
import { syncSelectedRows } from './lib/selectedRows';
import { toColumnDefs, toColumnPinning } from './lib/toColumnDefs';

export interface UseDataTableOptions<TData extends object> {
  data: MaybeRefOrGetter<readonly TData[]>;
  columns: MaybeRefOrGetter<readonly DataTableColumn<TData>[]>;
  getRowId?: (row: TData, index: number) => string;
  serverSide?: boolean;
  totalRowCount?: MaybeRefOrGetter<number>;
  sorting?: Ref<DataTableSortingState>;
  enableMultiSort?: boolean;
  pagination?: Ref<DataTablePaginationState>;
  rowSelection?: Ref<DataTableRowSelectionState>;
  selectedRows?: Ref<TData[]>;
  enableRowSelection?: (row: TData) => boolean;
  columnVisibility?: Ref<DataTableColumnVisibilityState>;
  expanded?: Ref<DataTableExpandedState>;
  getRowCanExpand?: (row: TData) => boolean;
  rowPinning?: Ref<DataTableRowPinningState>;
}

export function useDataTable<TData extends object>(options: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const { totalRowCount, enableRowSelection, getRowCanExpand } = options;
  const serverSide = options.serverSide ?? false;
  const sorting = options.sorting ?? ref<DataTableSortingState>([]);
  const pagination = options.pagination ?? ref<DataTablePaginationState>({ pageIndex: 0, pageSize: Infinity });
  const rowSelection = options.rowSelection ?? ref<DataTableRowSelectionState>({});
  const columnVisibility = options.columnVisibility ?? ref<DataTableColumnVisibilityState>({});
  const expanded = options.expanded ?? ref<DataTableExpandedState>({});
  const rowPinning = options.rowPinning ?? ref<DataTableRowPinningState>({ top: [], bottom: [] });
  const columnPinning = computed(() => toColumnPinning(toValue(options.columns)));

  const getRowId = options.getRowId ?? ((row: TData, index: number) => String(index));

  if (options.selectedRows !== undefined) {
    syncSelectedRows({
      selectedRows: options.selectedRows,
      rowSelection,
      rows: () => toValue(options.data),
      getRowId,
    });
  }

  function goToFirstPage() {
    if (pagination.value.pageIndex !== 0)
      pagination.value = { ...pagination.value, pageIndex: 0 };
  }

  const table = useTable({
    features,
    data: computed(() => toValue(options.data)),
    columns: computed(() => toColumnDefs(toValue(options.columns))),
    getRowId: options.getRowId,
    state: computed(() => ({
      sorting: sorting.value,
      pagination: pagination.value,
      rowSelection: rowSelection.value,
      columnVisibility: columnVisibility.value,
      columnPinning: columnPinning.value,
      expanded: expanded.value,
      rowPinning: rowPinning.value,
    })),
    onSortingChange: (updater) => {
      sorting.value = functionalUpdate(updater, sorting.value);
      goToFirstPage();
    },
    onPaginationChange: (updater) => {
      pagination.value = functionalUpdate(updater, pagination.value);
    },
    onRowSelectionChange: (updater) => {
      rowSelection.value = functionalUpdate(updater, rowSelection.value);
    },
    onColumnVisibilityChange: (updater) => {
      columnVisibility.value = functionalUpdate(updater, columnVisibility.value);
    },
    onExpandedChange: (updater) => {
      expanded.value = toExpandedState(functionalUpdate(updater, expanded.value));
    },
    manualSorting: serverSide,
    manualPagination: serverSide,
    rowCount: totalRowCount === undefined ? undefined : computed(() => toValue(totalRowCount)),
    enableMultiSort: options.enableMultiSort ?? false,
    sortDescFirst: false,
    enableRowSelection: enableRowSelection === undefined ? undefined : row => enableRowSelection(row.original),
    getRowCanExpand: row => getRowCanExpand?.(row.original) ?? true,
    autoResetExpanded: false,
    keepPinnedRows: true,
  });

  function toExpandedState(state: ExpandedState): DataTableExpandedState {
    const rowIds = state === true
      ? table.getPrePaginatedRowModel().rows.filter(row => row.getCanExpand()).map(row => row.id)
      : Object.keys(state);

    return Object.fromEntries(rowIds.map((rowId): [string, true] => [rowId, true]));
  }

  return createDataTableInstance(table);
}
