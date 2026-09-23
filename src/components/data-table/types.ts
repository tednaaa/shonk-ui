import type { HTMLAttributes, VNodeChild } from 'vue';

export interface DataTableCellContext<TData, TValue = unknown> {
  row: TData;
  value: TValue;
}

export interface DataTableHeaderContext {
  label: string;
}

export interface DataTableFooterContext<TData> {
  rows: TData[];
}

export type DataTableExportValue = string | number | null | undefined;

export type DataTableExportFormat = 'csv' | 'xlsx';

export interface DataTableSpanRowsContext<TData, TValue = unknown> {
  row: TData;
  value: TValue;
  anchorRow: TData;
  anchorValue: TValue;
}

interface DataTableColumnBase<TData> {
  kind?: undefined;
  header?: string;
  label?: string;
  footer?: string | ((context: DataTableFooterContext<TData>) => VNodeChild);
  hideable?: boolean;
  pinned?: boolean;
  class?: HTMLAttributes['class'];
  headerClass?: HTMLAttributes['class'];
}

export type DataTableAccessorKeyColumn<TData, TKey extends keyof TData & string> = DataTableColumnBase<TData> & {
  id?: string;
  accessorKey: TKey;
  accessorFn?: undefined;
  columns?: undefined;
  sortable?: boolean;
  spanRows?: boolean | ((context: DataTableSpanRowsContext<TData, TData[TKey]>) => boolean);
  cell?: (context: DataTableCellContext<TData, TData[TKey]>) => VNodeChild;
  exportValue?: (context: DataTableCellContext<TData, TData[TKey]>) => DataTableExportValue;
};

export type DataTableAccessorFnColumn<TData> = DataTableColumnBase<TData> & {
  id: string;
  accessorKey?: undefined;
  accessorFn: (row: TData) => unknown;
  columns?: undefined;
  sortable?: boolean;
  spanRows?: boolean | ((context: DataTableSpanRowsContext<TData>) => boolean);
  cell?: (context: DataTableCellContext<TData>) => VNodeChild;
  exportValue?: (context: DataTableCellContext<TData>) => DataTableExportValue;
};

export type DataTableDisplayColumn<TData> = DataTableColumnBase<TData> & {
  id: string;
  accessorKey?: undefined;
  accessorFn?: undefined;
  columns?: undefined;
  sortable?: undefined;
  spanRows?: undefined;
  cell?: (context: DataTableCellContext<TData>) => VNodeChild;
  exportValue?: (context: DataTableCellContext<TData>) => DataTableExportValue;
};

export interface DataTableGroupColumn<TData> {
  kind?: undefined;
  id: string;
  header?: string;
  label?: undefined;
  footer?: undefined;
  hideable?: undefined;
  pinned?: undefined;
  headerClass?: HTMLAttributes['class'];
  accessorKey?: undefined;
  accessorFn?: undefined;
  columns: DataTableColumn<TData>[];
  sortable?: undefined;
  spanRows?: undefined;
  cell?: undefined;
  exportValue?: undefined;
}

export interface DataTableSelectColumn {
  kind: 'select';
  id: string;
  label?: undefined;
  footer?: undefined;
  hideable?: undefined;
  pinned?: undefined;
  accessorKey?: undefined;
  accessorFn?: undefined;
  columns?: undefined;
  sortable?: undefined;
  spanRows?: undefined;
  cell?: undefined;
  exportValue?: undefined;
}

export interface DataTableExpandColumn {
  kind: 'expand';
  id: string;
  label?: undefined;
  footer?: undefined;
  hideable?: undefined;
  pinned?: undefined;
  accessorKey?: undefined;
  accessorFn?: undefined;
  columns?: undefined;
  sortable?: undefined;
  spanRows?: undefined;
  cell?: undefined;
  exportValue?: undefined;
}

export type DataTableColumn<TData>
  = | { [TKey in keyof TData & string]: DataTableAccessorKeyColumn<TData, TKey> }[keyof TData & string]
    | DataTableAccessorFnColumn<TData>
    | DataTableDisplayColumn<TData>
    | DataTableGroupColumn<TData>
    | DataTableSelectColumn
    | DataTableExpandColumn;

export interface DataTableColumnSort {
  id: string;
  desc: boolean;
}

export type DataTableSortingState = DataTableColumnSort[];

export interface DataTablePaginationState {
  pageIndex: number;
  pageSize: number;
}

export type DataTableRowSelectionState = Record<string, true>;

export type DataTableColumnVisibilityState = Record<string, boolean>;

export type DataTableExpandedState = Record<string, true>;

export interface DataTableRowPinningState {
  top: string[];
  bottom: string[];
}

declare const rowType: unique symbol;

export interface DataTableInstance<TData> {
  readonly [rowType]?: TData;
}
