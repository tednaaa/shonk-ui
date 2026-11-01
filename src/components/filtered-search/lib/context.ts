import type { InjectionKey } from 'vue';
import type { useFilteredSearch } from './useFilteredSearch';
import { inject } from 'vue';

export type FilteredSearchContext = ReturnType<typeof useFilteredSearch>;

export const filteredSearchKey: InjectionKey<FilteredSearchContext> = Symbol('filteredSearch');

export function useFilteredSearchContext() {
	const context = inject(filteredSearchKey);
	if (!context)
		throw new Error('FilterDropdown must be used inside FilteredSearch');
	return context;
}
