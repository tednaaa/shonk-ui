import type { MaybeRefOrGetter, Ref } from 'vue';
import type { DataTableColumn, DataTableColumnSizingState } from './types';
import { useLocalStorage } from '@vueuse/core';
import { toValue, watch } from 'vue';
import { leafColumnIds } from './lib/toColumnDefs';

export function useStoredColumnSizing<TData extends object>(
  storageKey: string,
  columns: MaybeRefOrGetter<readonly DataTableColumn<TData>[]>,
): Ref<DataTableColumnSizingState> {
  const columnSizing = useLocalStorage<DataTableColumnSizingState>(storageKey, {});

  watch(() => leafColumnIds(toValue(columns)), (ids) => {
    columnSizing.value = Object.fromEntries(ids.flatMap((id) => {
      const width = columnSizing.value[id];

      return typeof width === 'number' ? [[id, width]] : [];
    }));
  }, { immediate: true });

  return columnSizing;
}
