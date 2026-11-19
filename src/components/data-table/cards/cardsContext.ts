import type { Cell, Row } from '@tanstack/vue-table';
import type { ComputedRef, InjectionKey, Ref, Slots } from 'vue';
import type { KitFeatures } from '../core/features';
import type { CardSlot } from './cards';
import { useId } from 'reka-ui';
import { computed, inject, provide } from 'vue';

type KitRow = Row<KitFeatures, object>;

type KitCell = Cell<KitFeatures, object, unknown>;

export interface CardSort {
	desc: boolean;
}

interface CardsContext {
	slotOf: (columnId: string) => CardSlot | undefined;
	shownFieldIds: ComputedRef<string[]>;
	fieldLimit: ComputedRef<number>;
	sortOf: (columnId: string) => CardSort | undefined;
	slots: Slots;
}

interface CardItem {
	row: () => KitRow;
	expanded: Ref<boolean>;
	titleId: string;
}

const cardsKey: InjectionKey<CardsContext> = Symbol('data-table-cards');

const cardItemKey: InjectionKey<CardItem> = Symbol('data-table-card-item');

export function provideCards(context: CardsContext) {
	provide(cardsKey, context);
}

export function provideCardItem<TData extends object>(row: () => Row<KitFeatures, TData>, expanded: Ref<boolean>) {
	provide(cardItemKey, { row: row as unknown as () => KitRow, expanded, titleId: useId() });
}

export interface UseCardOptions {
	fieldLimit?: () => number | undefined;
}

export function useCard(options: UseCardOptions = {}) {
	const cards = inject(cardsKey);
	const item = inject(cardItemKey);

	if (cards === undefined || item === undefined)
		throw new Error('DataTableCard parts render inside the card slot of DataTable');

	const { slotOf } = cards;
	const { row, expanded, titleId } = item;

	const cells = computed(() => row().getAllCells());

	const cellById = computed(() => new Map(cells.value.map(cell => [cell.column.id, cell])));

	const visibleCells = computed(() => cells.value.filter(cell => cell.column.getIsVisible()));

	function cellsIn(...slots: CardSlot[]) {
		return visibleCells.value.filter((cell) => {
			const slot = slotOf(cell.column.id);

			return slot !== undefined && slots.includes(slot);
		});
	}

	function label(cell: KitCell) {
		return cell.column.columnDef.meta?.label ?? cell.column.id;
	}

	const titleIndex = computed(() => visibleCells.value.findIndex(cell => slotOf(cell.column.id) === 'title'));

	const actions = computed(() => cellsIn('action', 'expand'));

	const allFields = computed(() => cards.shownFieldIds.value.flatMap(columnId => cellById.value.get(columnId) ?? []));

	const fieldLimit = computed(() => options.fieldLimit?.() ?? cards.fieldLimit.value);

	const hiddenFields = computed(() => allFields.value.slice(fieldLimit.value));

	function toggleExpanded() {
		expanded.value = !expanded.value;
	}

	return {
		row,
		slots: cards.slots,
		sortOf: cards.sortOf,
		label,
		cell: (columnId: string) => cellById.value.get(columnId),
		select: computed(() => cellsIn('select')[0]),
		title: computed(() => cellsIn('title')),
		titleId,
		leadingActions: computed(() => actions.value.filter(cell => visibleCells.value.indexOf(cell) < titleIndex.value)),
		trailingActions: computed(() => actions.value.filter(cell => visibleCells.value.indexOf(cell) > titleIndex.value)),
		fields: computed(() => (expanded.value ? allFields.value : allFields.value.slice(0, fieldLimit.value))),
		hiddenFields,
		expanded,
		toggleExpanded,
	};
}
