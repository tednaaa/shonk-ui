import type { Column, Row } from '@tanstack/vue-table';
import type { DataTableExportValue, DataTableInstance } from '../types';
import type { KitFeatures, KitTable } from './features';
import { unwrapDataTable, unwrapExportValues } from './instance';
import { getDisplayedRows } from './rowPinning';

export interface DataTableExportData {
  header: string[];
  rows: DataTableExportValue[][];
}

export function exportRows<TData extends object>(instance: DataTableInstance<TData>): DataTableExportData {
  const table = unwrapDataTable(instance);
  const exportValues = unwrapExportValues(instance);
  const columns = visibleLeafColumns(table).filter(column => column.accessorFn !== undefined || exportValues.has(column.id));

  function cellValue(row: Row<KitFeatures, TData>, column: Column<KitFeatures, TData>): DataTableExportValue {
    const exportValue = exportValues.get(column.id);

    return exportValue ? exportValue(row.original) : toExportValue(row.getValue(column.id));
  }

  return {
    header: columns.map(columnHeader),
    rows: getDisplayedRows(table).map(row => columns.map(column => cellValue(row, column))),
  };
}

function columnHeader<TData extends object>(column: Column<KitFeatures, TData>): string {
  const groupHeaders = [];

  for (let group = column.parent; group; group = group.parent) {
    if (typeof group.columnDef.header === 'string')
      groupHeaders.unshift(group.columnDef.header);
  }

  return [...groupHeaders, column.columnDef.meta?.label ?? column.id].join(' / ');
}

function visibleLeafColumns<TData extends object>(table: KitTable<TData>): Column<KitFeatures, TData>[] {
  return [
    ...table.getStartVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getEndVisibleLeafColumns(),
  ];
}

function toExportValue(value: unknown): DataTableExportValue {
  if (value === null || value === undefined || typeof value === 'string' || typeof value === 'number')
    return value;

  return String(value);
}
