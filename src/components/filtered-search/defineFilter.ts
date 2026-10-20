import type { FilterDefinition, FilterOption } from './types';

export function defineFilter<O extends FilterOption>(definition: FilterDefinition<O>) {
	// NOTE: erases the option type so definitions with different options share one FilterDefinition[]
	return definition as unknown as FilterDefinition;
}
