import type { KitColumnMeta } from '../core/features';
import type { DataTableColumnVisibilityState, DataTableSortingState } from '../types';

export type CardSlot = NonNullable<KitColumnMeta['card']>;

export interface CardColumn {
	id: string;
	header: unknown;
	card?: CardSlot;
}

export function resolveCardSlots(columns: readonly CardColumn[]): Map<string, CardSlot> {
	let titleTaken = columns.some(column => column.card === 'title');

	return new Map(columns.map((column): [string, CardSlot] => {
		if (column.card !== undefined)
			return [column.id, column.card];

		if (typeof column.header !== 'string' || column.header === '')
			return [column.id, 'action'];

		if (titleTaken)
			return [column.id, 'field'];

		titleTaken = true;

		return [column.id, 'title'];
	}));
}

export interface CardFieldsOptions {
	fieldIds: readonly string[];
	columnVisibility: DataTableColumnVisibilityState;
	cardVisibility: DataTableColumnVisibilityState;
}

export const defaultCardFieldLimit = 4;

export function selectedCardFieldIds({ fieldIds, columnVisibility, cardVisibility }: CardFieldsOptions): string[] {
	if (Object.keys(cardVisibility).length > 0)
		return fieldIds.filter(id => cardVisibility[id] === true);

	return fieldIds.filter(id => columnVisibility[id] !== false);
}

export function orderCardFieldIds(selectedIds: readonly string[], fieldIds: readonly string[], sorting: DataTableSortingState): string[] {
	const sortedIds = sorting.map(sort => sort.id).filter(id => fieldIds.includes(id));

	return [...sortedIds, ...selectedIds.filter(id => !sortedIds.includes(id))];
}

export interface SortFieldOptions {
	id: string;
	descFirst: boolean;
}

export function sortOnlyBy(sorting: DataTableSortingState, { id, descFirst }: SortFieldOptions): DataTableSortingState {
	const current = sorting.find(sort => sort.id === id);

	if (current !== undefined && sorting.length === 1)
		return [{ id, desc: !current.desc }];

	return [{ id, desc: current?.desc ?? descFirst }];
}

export function addSort(sorting: DataTableSortingState, { id, descFirst }: SortFieldOptions): DataTableSortingState {
	return [...sorting.filter(sort => sort.id !== id), { id, desc: descFirst }];
}

export function flipSort(sorting: DataTableSortingState, id: string): DataTableSortingState {
	return sorting.map(sort => (sort.id === id ? { id, desc: !sort.desc } : sort));
}
