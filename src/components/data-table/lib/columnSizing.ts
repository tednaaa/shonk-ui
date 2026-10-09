import type { Column } from '@tanstack/vue-table';
import type { ComponentPublicInstance, MaybeRefOrGetter, StyleValue } from 'vue';
import type { KitFeatures, KitTable } from './features';
import { unrefElement } from '@vueuse/core';
import { createContext } from 'reka-ui';
import { computed, nextTick, onScopeDispose, toValue } from 'vue';

type ResizeHandler = (event: unknown) => void;

interface ColumnLayout {
  id: string;
  width: number | undefined;
}

export const [injectDataTableColumnSizing, provideDataTableColumnSizing] = createContext<{
  contentStyle: (columnId: string) => StyleValue | undefined;
  registerHeadCell: (columnId: string, cell: MaybeRefOrGetter<ComponentPublicInstance | null>) => void;
  startResize: (event: MouseEvent | TouchEvent, resize: ResizeHandler) => Promise<void>;
}>('DataTable');

export function useColumnSizing<TData extends object>(table: MaybeRefOrGetter<KitTable<TData>>) {
  const headCells = new Map<string, () => Element | null | undefined>();

  const enabled = computed(() => toValue(table).options.enableColumnResizing === true);

  const leafColumns = computed(() => (toValue(table).getFooterGroups()[0]?.headers ?? []).map(header => header.column));

  const columns = computed<ColumnLayout[]>(() => {
    const columnSizing = toValue(table).atoms.columnSizing.get();

    return leafColumns.value.map(column => ({
      id: column.id,
      width: Object.hasOwn(columnSizing, column.id) || column.columnDef.meta?.sized ? column.getSize() : undefined,
    }));
  });

  const fixed = computed(() => enabled.value
    && columns.value.length > 0
    && columns.value.every(column => column.width !== undefined));

  const widths = computed(() => new Map(columns.value.map(column => [column.id, column.width])));

  const tableAttrs = computed(() => fixed.value
    ? { class: 'table-fixed', style: { width: `${toValue(table).getTotalSize()}px` } }
    : undefined);

  function fixedColumnWidth(columnId: string): number | undefined {
    return fixed.value ? widths.value.get(columnId) : undefined;
  }

  function contentStyle(columnId: string): StyleValue | undefined {
    const width = widths.value.get(columnId);

    if (fixed.value || width === undefined)
      return undefined;

    return { maxWidth: `calc(${width}px - var(--spacing) * 4)` };
  }

  function registerHeadCell(columnId: string, cell: MaybeRefOrGetter<ComponentPublicInstance | null>) {
    const element = () => unrefElement(toValue(cell));

    headCells.set(columnId, element);
    onScopeDispose(() => {
      if (headCells.get(columnId) === element)
        headCells.delete(columnId);
    });
  }

  function measuredWidth(column: Column<KitFeatures, TData, unknown>): number {
    const width = headCells.get(column.id)?.()?.getBoundingClientRect().width;

    if (width === undefined)
      return column.getSize();

    const { minSize = 0, maxSize = Infinity } = column.columnDef;

    return Math.min(Math.max(Math.ceil(width), minSize), maxSize);
  }

  function freezeColumnWidths() {
    const measured = Object.fromEntries(leafColumns.value.map(column => [column.id, measuredWidth(column)]));

    toValue(table).setColumnSizing(columnSizing => ({ ...columnSizing, ...measured }));
  }

  async function startResize(event: MouseEvent | TouchEvent, resize: ResizeHandler) {
    if (!fixed.value) {
      freezeColumnWidths();
      await nextTick();
    }

    resize(event);
  }

  provideDataTableColumnSizing({ contentStyle, registerHeadCell, startResize });

  return { enabled, columns, tableAttrs, fixedColumnWidth };
}
