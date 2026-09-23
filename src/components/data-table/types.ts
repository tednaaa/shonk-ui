import type { HTMLAttributes, VNodeChild } from 'vue';

export interface DataTableCellContext<TData, TValue = unknown> {
  row: TData;
  value: TValue;
}

export interface DataTableHeaderContext {
  label: string;
}

interface DataTableColumnBase {
  header?: string;
  class?: HTMLAttributes['class'];
  headerClass?: HTMLAttributes['class'];
}

export type DataTableAccessorKeyColumn<TData, TKey extends keyof TData & string> = DataTableColumnBase & {
  id?: string;
  accessorKey: TKey;
  accessorFn?: undefined;
  columns?: undefined;
  cell?: (context: DataTableCellContext<TData, TData[TKey]>) => VNodeChild;
};

export type DataTableAccessorFnColumn<TData> = DataTableColumnBase & {
  id: string;
  accessorKey?: undefined;
  accessorFn: (row: TData) => unknown;
  columns?: undefined;
  cell?: (context: DataTableCellContext<TData>) => VNodeChild;
};

export type DataTableDisplayColumn<TData> = DataTableColumnBase & {
  id: string;
  accessorKey?: undefined;
  accessorFn?: undefined;
  columns?: undefined;
  cell?: (context: DataTableCellContext<TData>) => VNodeChild;
};

export interface DataTableGroupColumn<TData> {
  id: string;
  header?: string;
  headerClass?: HTMLAttributes['class'];
  accessorKey?: undefined;
  accessorFn?: undefined;
  columns: DataTableColumn<TData>[];
  cell?: undefined;
}

export type DataTableColumn<TData>
  = | { [TKey in keyof TData & string]: DataTableAccessorKeyColumn<TData, TKey> }[keyof TData & string]
    | DataTableAccessorFnColumn<TData>
    | DataTableDisplayColumn<TData>
    | DataTableGroupColumn<TData>;

declare const rowType: unique symbol;

export interface DataTableInstance<TData> {
  readonly [rowType]?: TData;
}
