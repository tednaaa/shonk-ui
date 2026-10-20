import type { Component, VNodeChild } from 'vue';

export interface FilterOption {
	value: string;
	label: string;
}

export interface FilterOperator {
	value: string;
	label: string;
}

export interface FilterDefinition<O extends FilterOption = FilterOption> {
	key: string;
	label: string;
	operators: FilterOperator[];
	icon?: Component;
	editor?: Component;
	options?: O[];
	multiSelect?: boolean;
	unique?: boolean;
	validate?: (value: string) => string | undefined;
	renderOption?: (option: O) => VNodeChild;
	renderValue?: (context: { filter: ActiveFilter; options: O[] }) => VNodeChild;
}

export interface ActiveFilter {
	id: string;
	key: string;
	keyLabel: string;
	operator: string;
	operatorLabel: string;
	value: string | string[];
	valueLabel: string;
}

export interface FilterHistoryItem {
	filters: ActiveFilter[];
	searchText?: string;
}

export type FilterTokenSegment = 'key' | 'operator' | 'value';
