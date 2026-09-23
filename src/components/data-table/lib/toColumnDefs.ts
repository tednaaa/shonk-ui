import type { CellContext, ColumnDef } from '@tanstack/vue-table';
import type { VNodeChild } from 'vue';
import type {
  DataTableAccessorFnColumn,
  DataTableAccessorKeyColumn,
  DataTableColumn,
  DataTableDisplayColumn,
  DataTableGroupColumn,
} from '../types';
import type { KitFeatures } from './features';

type KitColumnDef<TData extends object> = ColumnDef<KitFeatures, TData>;

type KitCellRender<TData extends object> = (context: CellContext<KitFeatures, TData>) => VNodeChild;

type AnyDataTableColumn<TData>
  = | DataTableAccessorKeyColumn<TData, keyof TData & string>
    | DataTableAccessorFnColumn<TData>
    | DataTableDisplayColumn<TData>
    | DataTableGroupColumn<TData>;

export function toColumnDefs<TData extends object>(columns: readonly DataTableColumn<TData>[]): KitColumnDef<TData>[] {
  return columns.map(toColumnDef);
}

function toColumnDef<TData extends object>(column: AnyDataTableColumn<TData>): KitColumnDef<TData> {
  if (column.columns) {
    return {
      id: column.id,
      header: column.header,
      meta: { headerClass: column.headerClass },
      columns: toColumnDefs(column.columns),
    };
  }

  const base = {
    header: column.header,
    enableSorting: column.sortable ?? false,
    meta: { class: column.class, headerClass: column.headerClass },
  };

  if (isAccessorKeyColumn(column)) {
    const { accessorKey, cell } = column;

    return {
      ...base,
      id: column.id ?? accessorKey,
      accessorKey,
      ...cellDef<TData>(cell && (({ row }) => cell({ row: row.original, value: row.original[accessorKey] }))),
    };
  }

  const { accessorFn, cell } = column;

  if (accessorFn) {
    return {
      ...base,
      id: column.id,
      accessorFn,
      ...cellDef<TData>(cell && (({ row, getValue }) => cell({ row: row.original, value: getValue() }))),
    };
  }

  return {
    ...base,
    id: column.id,
    ...cellDef<TData>(cell && (({ row }) => cell({ row: row.original, value: undefined }))),
  };
}

function cellDef<TData extends object>(render: KitCellRender<TData> | undefined): Pick<KitColumnDef<TData>, 'cell'> {
  return render ? { cell: render } : {};
}

function isAccessorKeyColumn<TData>(column: AnyDataTableColumn<TData>): column is DataTableAccessorKeyColumn<TData, keyof TData & string> {
  return column.accessorKey !== undefined;
}
