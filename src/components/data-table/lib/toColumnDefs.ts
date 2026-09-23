import type { CellContext, ColumnDef, ColumnPinningState } from '@tanstack/vue-table';
import type { VNodeChild } from 'vue';
import type {
  DataTableAccessorFnColumn,
  DataTableAccessorKeyColumn,
  DataTableColumn,
  DataTableDisplayColumn,
  DataTableExpandColumn,
  DataTableFooterContext,
  DataTableGroupColumn,
  DataTableSelectColumn,
  DataTableSpanRowsContext,
} from '../types';
import type { KitFeatures } from './features';
import { h } from 'vue';
import DataTableExpandAllRowsButton from '../DataTableExpandAllRowsButton.vue';
import DataTableExpandRowButton from '../DataTableExpandRowButton.vue';
import DataTableSelectPageRowsCheckbox from '../DataTableSelectPageRowsCheckbox.vue';
import DataTableSelectRowCheckbox from '../DataTableSelectRowCheckbox.vue';
import { getDisplayedRows } from './rowPinning';

type KitColumnDef<TData extends object> = ColumnDef<KitFeatures, TData>;

type KitCellRender<TData extends object> = (context: CellContext<KitFeatures, TData>) => VNodeChild;

type DataTableColumnFooter<TData> = string | ((context: DataTableFooterContext<TData>) => VNodeChild);

type AnyDataTableColumn<TData>
  = | DataTableAccessorKeyColumn<TData, keyof TData & string>
    | DataTableAccessorFnColumn<TData>
    | DataTableDisplayColumn<TData>
    | DataTableGroupColumn<TData>
    | DataTableSelectColumn
    | DataTableExpandColumn;

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

  if (column.kind === 'expand') {
    return {
      id: column.id,
      enableHiding: false,
      meta: { class: 'w-px', headerClass: 'w-px' },
      header: ({ table }) => h(DataTableExpandAllRowsButton<TData>, { table }),
      cell: ({ row }) => h(DataTableExpandRowButton<TData>, { row }),
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
      ...spanRowsDef<TData, TData[typeof accessorKey]>(column.spanRows, row => row[accessorKey]),
      ...cellDef<TData>(cell && (({ row }) => cell({ row: row.original, value: row.original[accessorKey] }))),
    };
  }

  const { accessorFn, cell } = column;

  if (accessorFn) {
    return {
      ...base,
      id: column.id,
      accessorFn,
      ...spanRowsDef<TData, unknown>(column.spanRows, accessorFn),
      ...cellDef<TData>(cell && (({ row, getValue }) => cell({ row: row.original, value: getValue() }))),
    };
  }

  return {
    ...base,
    id: column.id,
    ...cellDef<TData>(cell && (({ row }) => cell({ row: row.original, value: undefined }))),
  };
}

function spanRowsDef<TData extends object, TValue>(
  spanRows: boolean | ((context: DataTableSpanRowsContext<TData, TValue>) => boolean) | undefined,
  value: (row: TData) => TValue,
): Pick<KitColumnDef<TData>, 'spanRows'> {
  if (spanRows === undefined)
    return {};

  if (typeof spanRows !== 'function')
    return { spanRows };

  return {
    spanRows: ({ row, anchorRow }) => spanRows({
      row: row.original,
      value: value(row.original),
      anchorRow: anchorRow.original,
      anchorValue: value(anchorRow.original),
    }),
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

  return ({ table }) => footer({ rows: getDisplayedRows(table).map(row => row.original) });
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
