import type { KitTable } from '../core/features';
import type { DataTableCardsState } from '../core/instance';
import { computed } from 'vue';
import { orderCardFieldIds, resolveCardSlots, selectedCardFieldIds } from './cards';

export function useCardFields<TData extends object>(table: () => KitTable<TData>, cards: () => DataTableCardsState) {
	const columns = computed(() => table().getAllLeafColumns());

	const slots = computed(() => resolveCardSlots(columns.value.map(column => ({
		id: column.id,
		header: column.columnDef.header,
		card: column.columnDef.meta?.card,
	}))));

	const fieldColumns = computed(() => columns.value.filter(column => slots.value.get(column.id) === 'field'));

	const fieldIds = computed(() => fieldColumns.value.map(column => column.id));

	const selectedIds = computed(() => selectedCardFieldIds({
		fieldIds: fieldIds.value,
		columnVisibility: table().atoms.columnVisibility.get(),
		cardVisibility: cards().visibility.value,
	}));

	const shownIds = computed(() => orderCardFieldIds(selectedIds.value, fieldIds.value, table().atoms.sorting.get()));

	function select(ids: readonly string[]) {
		cards().visibility.value = Object.fromEntries(fieldIds.value.map(id => [id, ids.includes(id)]));
	}

	return { slots, fieldColumns, selectedIds, shownIds, select };
}
