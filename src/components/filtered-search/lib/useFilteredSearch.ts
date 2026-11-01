import type { MaybeRefOrGetter, Ref } from 'vue';
import type { ActiveFilter, FilterDefinition, FilterHistoryItem, FilterOperator, FilterOption, FilterTokenSegment, TokenParts } from '../types';
import { useFilter } from 'reka-ui';
import { computed, nextTick, ref, shallowRef, toValue, useId, watch } from 'vue';
import { pinFirst } from '@/utils';

type DropdownStep
	= | { phase: 'key' }
		| { phase: 'operator'; definition: FilterDefinition }
		| { phase: 'value'; definition: FilterDefinition; operator: FilterOperator };

function hasOperatorChoice(definition: FilterDefinition) {
	return definition.operators.length > 1;
}

function stepAfterKey(definition: FilterDefinition): DropdownStep {
	return hasOperatorChoice(definition)
		? { phase: 'operator', definition }
		: { phase: 'value', definition, operator: definition.operators[0] };
}

function appliedOperator(definition: FilterDefinition, filter: ActiveFilter): FilterOperator {
	return definition.operators.find(operator => operator.value === filter.operator)
		?? { value: filter.operator, label: filter.operatorLabel };
}

export function useFilteredSearch(options: {
	definitions: MaybeRefOrGetter<FilterDefinition[]>;
	searchable: MaybeRefOrGetter<boolean>;
	filters: Ref<ActiveFilter[]>;
	searchText: Ref<string>;
}) {
	const { filters, searchText } = options;

	const isOpen = ref(false);
	const step = shallowRef<DropdownStep>({ phase: 'key' });
	const inputText = ref('');
	const inputRef = ref<HTMLInputElement | null>(null);
	const isEditedKeyUntouched = ref(false);
	const highlightedIndex = ref(-1);
	const selectedValues = ref<FilterOption[]>([]);
	const pinnedValues = ref<string[]>([]);
	const editingId = ref<string | null>(null);
	const valueError = ref<string | null>(null);
	const valueHintId = useId();

	const operatorStep = computed(() => step.value.phase === 'operator' ? step.value : null);
	const valueStep = computed(() => step.value.phase === 'value' ? step.value : null);

	const editingFilter = computed(() => filters.value.find(filter => filter.id === editingId.value) ?? null);

	const availableDefinitions = computed(() => toValue(options.definitions).filter(definition =>
		!definition.unique || !filters.value.some(filter => filter.key === definition.key && filter.id !== editingId.value),
	));

	const { contains } = useFilter({ sensitivity: 'base' });

	function matchesQuery(...texts: string[]) {
		return texts.some(text => contains(text, inputText.value));
	}

	const filteredDefinitions = computed(() => {
		if (step.value.phase !== 'key' || !inputText.value || isEditedKeyUntouched.value)
			return availableDefinitions.value;
		return availableDefinitions.value.filter(definition => matchesQuery(definition.label, definition.key));
	});

	const valueDefinition = computed(() => valueStep.value?.definition ?? null);

	const definitionsByKey = computed(() => new Map(toValue(options.definitions).map(definition => [definition.key, definition])));

	function definitionOf(filter: ActiveFilter) {
		return definitionsByKey.value.get(filter.key);
	}

	const suggestsOptions = computed(() => Boolean(valueDefinition.value?.options && !valueDefinition.value.editor));

	const isMultiSelect = computed(() => suggestsOptions.value && Boolean(valueDefinition.value?.multiSelect));

	const valueOptions = computed(() => {
		if (!suggestsOptions.value)
			return [];
		const options = pinFirst(valueDefinition.value?.options ?? [], pinnedValues.value);
		return inputText.value ? options.filter(option => matchesQuery(option.label, option.value)) : options;
	});

	const highlightableCount = computed(() => {
		if (step.value.phase === 'key')
			return filteredDefinitions.value.length;
		if (operatorStep.value)
			return operatorStep.value.definition.operators.length;
		return valueOptions.value.length;
	});

	const stepLabel = computed(() => {
		const s = step.value;
		if (s.phase === 'key')
			return null;
		if (s.phase === 'operator')
			return s.definition.label;
		return `${s.definition.label} ${s.operator.label}`;
	});

	const pendingParts = computed<TokenParts | null>(() => {
		const s = step.value;
		if (s.phase === 'key')
			return null;
		return { key: s.definition.label, operator: s.phase === 'value' ? s.operator.label : undefined };
	});

	const editedRest = computed<TokenParts | null>(() => {
		const filter = editingFilter.value;
		const s = step.value;
		if (!filter)
			return null;
		if (s.phase === 'key')
			return { operator: filter.operatorLabel, value: filter.valueLabel };
		if (s.phase === 'operator' && s.definition.key === filter.key)
			return { value: filter.valueLabel };
		return null;
	});

	const pendingEditableSegments = computed<FilterTokenSegment[]>(() => {
		const s = step.value;
		return s.phase === 'value' && hasOperatorChoice(s.definition) ? ['key', 'operator'] : ['key'];
	});

	const hasActiveFilters = computed(() => filters.value.length > 0 || !!searchText.value);

	function focusInput() {
		nextTick(() => inputRef.value?.focus());
	}

	function showStep(next: DropdownStep) {
		step.value = next;
		inputText.value = '';
		isEditedKeyUntouched.value = false;
		highlightedIndex.value = -1;
		selectedValues.value = [];
		pinnedValues.value = [];
	}

	function prefillEditedValue() {
		const filter = editingFilter.value;
		const definition = valueDefinition.value;
		if (!filter || !definition || definition.key !== filter.key)
			return;
		const values = [filter.value].flat();
		if (definition.multiSelect) {
			selectedValues.value = definition.options?.filter(option => values.includes(option.value)) ?? [];
			pinnedValues.value = values;
		}
		else if (!definition.options && !definition.editor) {
			inputText.value = values.join(', ');
		}
	}

	function pickStep(next: DropdownStep) {
		showStep(next);
		prefillEditedValue();
		focusInput();
	}

	function resetToKeyPhase() {
		editingId.value = null;
		showStep({ phase: 'key' });
	}

	function selectKey(definition: FilterDefinition) {
		pickStep(stepAfterKey(definition));
	}

	function selectOperator(operator: FilterOperator) {
		const s = operatorStep.value;
		if (s)
			pickStep({ phase: 'value', definition: s.definition, operator });
	}

	function commitFilter(value: string | string[], valueLabel: string) {
		const s = valueStep.value;
		if (!s)
			return;
		const filter: ActiveFilter = {
			id: editingId.value ?? crypto.randomUUID(),
			key: s.definition.key,
			keyLabel: s.definition.label,
			operator: s.operator.value,
			operatorLabel: s.operator.label,
			value,
			valueLabel,
		};
		filters.value = editingId.value
			? filters.value.map(existing => existing.id === filter.id ? filter : existing)
			: [...filters.value, filter];
		resetToKeyPhase();
		focusInput();
	}

	function confirmValue(option: FilterOption) {
		commitFilter(option.value, option.label);
	}

	function confirmTypedValue() {
		const typed = inputText.value.trim();
		if (!typed || suggestsOptions.value || valueDefinition.value?.editor)
			return;
		const error = valueDefinition.value?.validate?.(typed);
		if (error) {
			valueError.value = error;
			return;
		}
		commitFilter(typed, typed);
	}

	function renderValue(filter: ActiveFilter) {
		const definition = definitionOf(filter);
		const values = [filter.value].flat();
		const options = definition?.options?.filter(option => values.includes(option.value)) ?? [];
		return definition?.renderValue?.({ filter, options });
	}

	function isSelected(option: FilterOption) {
		return selectedValues.value.some(selected => selected.value === option.value);
	}

	function toggleValue(option: FilterOption) {
		selectedValues.value = isSelected(option)
			? selectedValues.value.filter(selected => selected.value !== option.value)
			: [...selectedValues.value, option];
	}

	function resetSelectedValues() {
		selectedValues.value = [];
		focusInput();
	}

	function applySelectedValues() {
		if (!selectedValues.value.length)
			return;
		commitFilter(
			selectedValues.value.map(selected => selected.value),
			selectedValues.value.map(selected => selected.label).join(', '),
		);
	}

	function chooseValue(option: FilterOption) {
		if (isMultiSelect.value)
			toggleValue(option);
		else
			confirmValue(option);
	}

	function removeFilter(id: string) {
		filters.value = filters.value.filter(filter => filter.id !== id);
	}

	function showEditedKey() {
		const filter = editingFilter.value;
		if (!filter)
			return;
		showStep({ phase: 'key' });
		inputText.value = filter.keyLabel;
		isEditedKeyUntouched.value = true;
		nextTick(() => {
			highlightedIndex.value = filteredDefinitions.value.findIndex(definition => definition.key === filter.key);
			inputRef.value?.focus();
			inputRef.value?.select();
		});
	}

	function editPendingSegment(segment: FilterTokenSegment) {
		const s = step.value;
		if (segment === 'key')
			pickStep({ phase: 'key' });
		else if (segment === 'operator' && s.phase === 'value')
			pickStep({ phase: 'operator', definition: s.definition });
	}

	function editFilter(id: string, segment: FilterTokenSegment) {
		const filter = filters.value.find(existing => existing.id === id);
		const definition = filter && definitionOf(filter);
		if (!filter || !definition?.operators.length)
			return;
		editingId.value = id;
		isOpen.value = true;
		if (segment === 'key')
			showEditedKey();
		else if (segment === 'operator' && hasOperatorChoice(definition))
			pickStep({ phase: 'operator', definition });
		else
			pickStep({ phase: 'value', definition, operator: appliedOperator(definition, filter) });
	}

	function clearAll() {
		filters.value = [];
		searchText.value = '';
		resetToKeyPhase();
	}

	function selectHistoryItem(item: FilterHistoryItem) {
		filters.value = item.filters.map(filter => ({ ...filter, id: crypto.randomUUID() }));
		searchText.value = item.searchText ?? '';
		resetToKeyPhase();
	}

	function backToKey() {
		if (editingId.value)
			showEditedKey();
		else
			resetToKeyPhase();
	}

	function goBack() {
		const s = step.value;
		if (s.phase === 'value' && hasOperatorChoice(s.definition))
			showStep({ phase: 'operator', definition: s.definition });
		else if (s.phase !== 'key')
			backToKey();
		focusInput();
	}

	function cancel() {
		resetToKeyPhase();
		isOpen.value = false;
		inputRef.value?.blur();
	}

	function confirmHighlighted() {
		if (step.value.phase === 'key') {
			if (highlightedIndex.value >= 0) {
				selectKey(filteredDefinitions.value[highlightedIndex.value]);
			}
			else if (toValue(options.searchable) && !editingId.value && inputText.value.trim()) {
				searchText.value = inputText.value.trim();
				inputText.value = '';
				isOpen.value = false;
			}
			return;
		}

		if (operatorStep.value) {
			if (highlightedIndex.value >= 0)
				selectOperator(operatorStep.value.definition.operators[highlightedIndex.value]);
			return;
		}

		if (highlightedIndex.value >= 0)
			chooseValue(valueOptions.value[highlightedIndex.value]);
		else if (isMultiSelect.value)
			applySelectedValues();
		else
			confirmTypedValue();
	}

	function stepBackOnEmptyInput() {
		if (selectedValues.value.length) {
			selectedValues.value = selectedValues.value.slice(0, -1);
			return;
		}
		if (step.value.phase !== 'key') {
			goBack();
			return;
		}
		if (editingId.value) {
			removeFilter(editingId.value);
			resetToKeyPhase();
		}
		else if (filters.value.length > 0) {
			filters.value = filters.value.slice(0, -1);
		}
		else if (searchText.value) {
			searchText.value = '';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!isOpen.value) {
				isOpen.value = true;
				highlightedIndex.value = Math.min(0, highlightableCount.value - 1);
				return;
			}
			highlightedIndex.value = Math.min(highlightedIndex.value + 1, highlightableCount.value - 1);
		}
		else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
		}
		else if (e.key === 'Enter') {
			e.preventDefault();
			confirmHighlighted();
		}
		else if (e.key === 'Escape') {
			e.preventDefault();
			cancel();
		}
		else if (e.key === 'Backspace' && inputText.value === '') {
			stepBackOnEmptyInput();
		}
	}

	watch(inputText, () => {
		valueError.value = null;
		highlightedIndex.value = -1;
		if (inputText.value && step.value.phase === 'key')
			isOpen.value = true;
	});

	watch(isOpen, (open) => {
		if (!open)
			resetToKeyPhase();
	});

	return {
		isOpen,
		step,
		inputText,
		inputRef,
		isEditedKeyUntouched,
		highlightedIndex,
		selectedValues,
		editingId,
		valueError,
		valueHintId,
		operatorStep,
		valueStep,
		filteredDefinitions,
		valueDefinition,
		suggestsOptions,
		isMultiSelect,
		valueOptions,
		stepLabel,
		pendingParts,
		editedRest,
		pendingEditableSegments,
		hasActiveFilters,
		definitionOf,
		renderValue,
		selectKey,
		selectOperator,
		confirmValue,
		isSelected,
		chooseValue,
		resetSelectedValues,
		applySelectedValues,
		removeFilter,
		editPendingSegment,
		editFilter,
		clearAll,
		selectHistoryItem,
		goBack,
		handleKeydown,
	};
}
