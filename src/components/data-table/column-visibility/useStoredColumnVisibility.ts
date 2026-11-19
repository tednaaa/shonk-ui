import type { MaybeRefOrGetter, Ref } from 'vue';
import type { DataTableColumn, DataTableColumnVisibilityState } from '../types';
import { useLocalStorage } from '@vueuse/core';
import { toValue, watch } from 'vue';
import { hideableColumnIds, leafColumnIds } from '../core/toColumnDefs';

const storedCardVisibility = new WeakMap<Ref<DataTableColumnVisibilityState>, Ref<DataTableColumnVisibilityState>>();

export function useStoredColumnVisibility<TData extends object>(
	storageKey: string,
	columns: MaybeRefOrGetter<readonly DataTableColumn<TData>[]>,
): Ref<DataTableColumnVisibilityState> {
	const columnVisibility = useLocalStorage<DataTableColumnVisibilityState>(storageKey, {});
	const cardVisibility = useLocalStorage<DataTableColumnVisibilityState>(`${storageKey}:cards`, {}, { writeDefaults: false });

	watch(() => hideableColumnIds(toValue(columns)), (ids) => {
		columnVisibility.value = Object.fromEntries(ids.map(id => [id, columnVisibility.value[id] ?? true]));
	}, { immediate: true });

	watch(() => leafColumnIds(toValue(columns)), (ids) => {
		if (Object.keys(cardVisibility.value).length === 0)
			return;

		cardVisibility.value = Object.fromEntries(ids.map(id => [id, cardVisibility.value[id] ?? columnVisibility.value[id] !== false]));
	}, { immediate: true });

	storedCardVisibility.set(columnVisibility, cardVisibility);

	return columnVisibility;
}

export function findStoredCardVisibility(columnVisibility: Ref<DataTableColumnVisibilityState> | undefined): Ref<DataTableColumnVisibilityState> | undefined {
	return columnVisibility && storedCardVisibility.get(columnVisibility);
}
