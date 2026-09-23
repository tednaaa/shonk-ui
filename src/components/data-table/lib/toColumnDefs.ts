import type { CellContext, ColumnDef, ColumnPinningState } from '@tanstack/vue-table';
import type { VNodeChild } from 'vue';
import type {
  DataTableAccessorFnColumn,
  DataTableAccessorKeyColumn,
  DataTableColumn,
  DataTableDisplayColumn,
  DataTableFooterContext,
  DataTableGroupColumn,
  DataTableSelectColumn,
} from '../types';
import type { KitFeatures } from './features';
import { h } from 'vue';
import DataTableSelectPageRowsCheckbox from '../DataTableSelectPageRowsCheckbox.vue';
import DataTableSelectRowCheckbox from '../DataTableSelectRowCheckbox.vue';

type KitColumnDef<TData extends object> = ColumnDef<KitFeatures, TData>;

type KitCellRender<TData extends object> = (context: CellContext<KitFeatures, TData>) => VNodeChild;

type DataTableColumnFooter<TData> = string | ((context: DataTableFooterContext<TData>) => VNodeChild);

type AnyDataTableColumn<TData>
  = | DataTableAccessorKeyColumn<TData, keyof TData & string>
    | DataTableAccessorFnColumn<TData>
    | DataTableDisplayColumn<TData>
    | DataTableGroupColumn<TData>
    | DataTableSelectColumn;

export function toColumnDefs<TData extends object>(columns: readonly DataTableColumn<TData>[]): KitColumnDef<TData>[] {
  return columns.map(toColumnDef);
}

function toColumnDef<TData extends object>(column: AnyDataTableColumn<TData>): KitColumnDef<TData> {
  if (column.kind === 'select') {
    return {
      id: column.id,
      enableHiding: false,
      meta: { class: 'w-px', headerClass: 'w-px' },
      header: ({ table }) => h(DataTableSelectPageRowsCheckbox<TData>, { table }),
      cell: ({ row }) => h(DataTableSelectRowCheckbox<TData>, { row }),
    };
  }

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
    footer: footerDef<TData>(column.footer),
    enableSorting: column.sortable ?? false,
    enableHiding: column.hideable ?? true,
    meta: { label: column.label ?? column.header, class: column.class, headerClass: column.headerClass },
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

export function toColumnPinning<TData extends object>(columns: readonly DataTableColumn<TData>[]): ColumnPinningState {
  return { start: columns.flatMap(pinnedColumnIds), end: [] };
}

function pinnedColumnIds<TData extends object>(column: AnyDataTableColumn<TData>): string[] {
  if (column.columns)
    return toColumnPinning(column.columns).start;

  if (!column.pinned)
    return [];

  return [columnId(column)];
}

function footerDef<TData extends object>(footer: DataTableColumnFooter<TData> | undefined): KitColumnDef<TData>['footer'] {
  if (typeof footer !== 'function')
    return footer;

  return ({ table }) => footer({ rows: table.getRowModel().rows.map(row => row.original) });
}

export function hideableColumnIds<TData extends object>(columns: readonly DataTableColumn<TData>[]): string[] {
  return columns.flatMap(hideableIds);
}

function hideableIds<TData extends object>(column: AnyDataTableColumn<TData>): string[] {
  if (column.columns)
    return hideableColumnIds(column.columns);

  if (column.kind !== undefined || column.hideable === false)
    return [];

  return [columnId(column)];
}

function columnId<TData>(column: AnyDataTableColumn<TData>): string {
  return isAccessorKeyColumn(column) ? column.id ?? column.accessorKey : column.id;
}
