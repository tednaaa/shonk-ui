import type { Ref } from 'vue';
import type { DataTableRowSelectionState } from '../types';
import { watch } from 'vue';

interface SyncSelectedRowsOptions<TData> {
  selectedRows: Ref<TData[]>;
  rowSelection: Ref<DataTableRowSelectionState>;
  rows: () => readonly TData[];
  getRowId: (row: TData, index: number) => string;
}

export function syncSelectedRows<TData>({ selectedRows, rowSelection, rows, getRowId }: SyncSelectedRowsOptions<TData>) {
  rowSelection.value = toRowSelection(selectedRows.value, getRowId);

  watch(rowSelection, (selection) => {
    const knownRows = new Map(selectedRows.value.map((row, index): [string, TData] => [getRowId(row, index), row]));

    for (const [index, row] of rows().entries())
      knownRows.set(getRowId(row, index), row);

    selectedRows.value = Object.keys(selection)
      .map(id => knownRows.get(id))
      .filter(row => row !== undefined);
  }, { deep: true });

  watch(selectedRows, (selected) => {
    const selection = toRowSelection(selected, getRowId);

    if (!holdsSameRows(selection, rowSelection.value))
      rowSelection.value = selection;
  }, { deep: true });
}

function toRowSelection<TData>(rows: readonly TData[], getRowId: (row: TData, index: number) => string): DataTableRowSelectionState {
  return Object.fromEntries(rows.map((row, index): [string, true] => [getRowId(row, index), true]));
}

function holdsSameRows(selection: DataTableRowSelectionState, other: DataTableRowSelectionState): boolean {
  const ids = Object.keys(selection);

  return ids.length === Object.keys(other).length && ids.every(id => id in other);
}
