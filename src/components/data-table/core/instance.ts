import type { Ref } from 'vue';
import type { DataTableColumnVisibilityState, DataTableInstance } from '../types';
import type { KitTable } from './features';
import type { DataTableExportValues } from './toColumnDefs';
import { markRaw } from 'vue';

const tableKey = Symbol('data-table');

const exportValuesKey = Symbol('data-table-export-values');

const cardsKey = Symbol('data-table-cards');

export interface DataTableCardsState {
	active: Ref<boolean>;
	fieldLimit: Ref<number>;
	visibility: Ref<DataTableColumnVisibilityState>;
}

interface KitDataTableInstance<TData extends object> extends DataTableInstance<TData> {
	readonly [tableKey]: KitTable<TData>;
	readonly [exportValuesKey]: () => DataTableExportValues<TData>;
	readonly [cardsKey]: DataTableCardsState;
}

export function createDataTableInstance<TData extends object>(
	table: KitTable<TData>,
	exportValues: () => DataTableExportValues<TData>,
	cards: DataTableCardsState,
): DataTableInstance<TData> {
	const instance: KitDataTableInstance<TData> = { [tableKey]: table, [exportValuesKey]: exportValues, [cardsKey]: cards };

	return markRaw(instance);
}

export function unwrapDataTable<TData extends object>(instance: DataTableInstance<TData>): KitTable<TData> {
	return kitInstance(instance)[tableKey];
}

export function unwrapExportValues<TData extends object>(instance: DataTableInstance<TData>): DataTableExportValues<TData> {
	return kitInstance(instance)[exportValuesKey]();
}

export function unwrapCards<TData extends object>(instance: DataTableInstance<TData>): DataTableCardsState {
	return kitInstance(instance)[cardsKey];
}

function kitInstance<TData extends object>(instance: DataTableInstance<TData>): KitDataTableInstance<TData> {
	if (!isKitDataTableInstance(instance))
		throw new TypeError('DataTable expects the table returned by useDataTable');

	return instance;
}

function isKitDataTableInstance<TData extends object>(instance: DataTableInstance<TData>): instance is KitDataTableInstance<TData> {
	return tableKey in instance;
}
