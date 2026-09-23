import type { MaybeRefOrGetter, Ref } from 'vue';
import type { DataTableColumn, DataTableColumnVisibilityState } from './types';
import { useLocalStorage } from '@vueuse/core';
import { toValue, watch } from 'vue';
import { hideableColumnIds } from './lib/toColumnDefs';

export function useStoredColumnVisibility<TData extends object>(
  storageKey: string,
  columns: MaybeRefOrGetter<readonly DataTableColumn<TData>[]>,
): Ref<DataTableColumnVisibilityState> {
  const columnVisibility = useLocalStorage<DataTableColumnVisibilityState>(storageKey, {});

  watch(() => hideableColumnIds(toValue(columns)), (ids) => {
    columnVisibility.value = Object.fromEntries(ids.map(id => [id, columnVisibility.value[id] ?? true]));
  }, { immediate: true });

  return columnVisibility;
}
