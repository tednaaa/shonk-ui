<script setup lang="ts">
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui';
import type { FunctionalComponent, HTMLAttributes, VNodeChild } from 'vue';
import type { ActiveFilter, FilterDefinition, FilterHistoryItem, FilterOperator, FilterOption, FilterTokenSegment } from './types';
import { CheckIcon, ChevronLeftIcon, CircleXIcon, SearchIcon, XIcon } from '@lucide/vue';
import { createReusableTemplate } from '@vueuse/core';
import { computed, nextTick, ref, useId, watch } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { Popover, PopoverAnchor, PopoverContent } from '../popover';
import FilterHistory from './FilterHistory.vue';
import FilterToken from './FilterToken.vue';
import { useTokenDrag } from './useTokenDrag';
import { filteredSearchTokenListVariants, filteredSearchVariants, filterTokenPartVariants, filterTokenVariants, searchTokenVariants, valueHintVariants } from './variants';

const props = withDefaults(defineProps<{
	definitions: FilterDefinition[];
	historyItems?: FilterHistoryItem[];
	placeholder?: string;
	searchable?: boolean;
	draggable?: boolean;
	viewOnly?: boolean;
	wrap?: boolean;
	class?: HTMLAttributes['class'];
}>(), {
	searchable: true,
	draggable: false,
	viewOnly: false,
	wrap: false,
});

const emit = defineEmits<{ clearHistory: [] }>();

defineSlots<{
	suffix?: () => unknown;
}>();

const filters = defineModel<ActiveFilter[]>('filters', { default: () => [] });
const searchText = defineModel<string>('searchText', { default: '' });

const RenderNode: FunctionalComponent<{ node: VNodeChild }> = props => props.node;

type TokenParts = Partial<Record<FilterTokenSegment, string>>;

type DropdownStep
	= | { phase: 'key' }
		| { phase: 'operator'; key: string; keyLabel: string; operators: FilterOperator[] }
		| { phase: 'value'; key: string; keyLabel: string; operator: string; operatorLabel: string };

const locale = useLocale();

const [DefineField, ReuseField] = createReusableTemplate<{ fieldClass?: HTMLAttributes['class'] }>();
const [DefineInput, ReuseInput] = createReusableTemplate();
const [DefineParts, ReuseParts] = createReusableTemplate<{ parts: TokenParts; rounded: 'start' | 'end'; editable?: FilterTokenSegment[] }>();

const isOpen = ref(false);
const step = ref<DropdownStep>({ phase: 'key' });
const inputText = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const anchorRef = ref<HTMLElement | null>(null);
const tokenListRef = ref<HTMLElement | null>(null);
const highlightedIndex = ref(-1);
const selectedValues = ref<FilterOption[]>([]);
const editingId = ref<string | null>(null);
const valueError = ref<string | null>(null);
const valueHintId = useId();

function preventCloseOnAnchorInteract(e: PointerDownOutsideEvent | FocusOutsideEvent) {
	const { target } = e.detail.originalEvent;
	if (target instanceof Node && anchorRef.value?.contains(target))
		e.preventDefault();
}

const operatorStep = computed(() => step.value.phase === 'operator' ? step.value : null);
const valueStep = computed(() => step.value.phase === 'value' ? step.value : null);

const editingFilter = computed(() => filters.value.find(filter => filter.id === editingId.value) ?? null);

const { draggingId, startDrag } = useTokenDrag({
	enabled: () => props.draggable && !props.viewOnly && !editingId.value,
	vertical: () => props.wrap,
	list: tokenListRef,
	filters,
});

const availableDefinitions = computed(() => props.definitions.filter(definition =>
	!definition.unique || !filters.value.some(filter => filter.key === definition.key && filter.id !== editingId.value),
));

const filteredDefinitions = computed(() => {
	if (step.value.phase !== 'key' || !inputText.value)
		return availableDefinitions.value;
	const query = inputText.value.toLowerCase();
	return availableDefinitions.value.filter(definition =>
		definition.label.toLowerCase().includes(query) || definition.key.toLowerCase().includes(query),
	);
});

const valueDefinition = computed(() => {
	const s = valueStep.value;
	return s ? props.definitions.find(definition => definition.key === s.key) ?? null : null;
});

const valueOperator = computed(() => {
	const s = valueStep.value;
	return valueDefinition.value?.operators.find(operator => operator.value === s?.operator) ?? null;
});

const suggestsOptions = computed(() => Boolean(valueDefinition.value?.options && !valueDefinition.value.editor));

const isMultiSelect = computed(() => suggestsOptions.value && Boolean(valueDefinition.value?.multiSelect));

const valueOptions = computed(() => {
	if (!suggestsOptions.value)
		return [];
	const options = valueDefinition.value?.options ?? [];
	if (!inputText.value)
		return options;
	const query = inputText.value.toLowerCase();
	return options.filter(option =>
		option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query),
	);
});

const highlightableCount = computed(() => {
	if (step.value.phase === 'key')
		return filteredDefinitions.value.length;
	if (operatorStep.value)
		return operatorStep.value.operators.length;
	return valueOptions.value.length;
});

const stepLabel = computed(() => {
	const s = step.value;
	if (s.phase === 'key')
		return null;
	if (s.phase === 'operator')
		return s.keyLabel;
	return `${s.keyLabel} ${s.operatorLabel}`;
});

const pendingParts = computed<TokenParts | null>(() => {
	const s = step.value;
	if (s.phase === 'key')
		return null;
	return { key: s.keyLabel, operator: s.phase === 'value' ? s.operatorLabel : undefined };
});

const editedRest = computed<TokenParts | null>(() => {
	const filter = editingFilter.value;
	const s = step.value;
	if (!filter)
		return null;
	if (s.phase === 'key')
		return { operator: filter.operatorLabel, value: filter.valueLabel };
	if (s.phase === 'operator' && s.key === filter.key)
		return { value: filter.valueLabel };
	return null;
});

const inputPlaceholder = computed(() => {
	if (step.value.phase === 'value')
		return locale.value.filteredSearch.enterValuePlaceholder;
	if (step.value.phase === 'operator')
		return locale.value.filteredSearch.selectOperatorPlaceholder;
	if (filters.value.length > 0 || searchText.value)
		return locale.value.filteredSearch.addFilterPlaceholder;
	return props.placeholder ?? locale.value.filteredSearch.placeholder;
});

const editingInputSize = computed(() => Math.max(inputText.value.length, step.value.phase === 'key' ? 1 : inputPlaceholder.value.length));

function focusInput() {
	nextTick(() => inputRef.value?.focus());
}

function showStep(next: DropdownStep) {
	step.value = next;
	inputText.value = '';
	highlightedIndex.value = -1;
	selectedValues.value = [];
}

function resetToKeyPhase() {
	editingId.value = null;
	showStep({ phase: 'key' });
}

function selectKey(definition: FilterDefinition) {
	const [only] = definition.operators;
	step.value = definition.operators.length === 1
		? { phase: 'value', key: definition.key, keyLabel: definition.label, operator: only.value, operatorLabel: only.label }
		: { phase: 'operator', key: definition.key, keyLabel: definition.label, operators: definition.operators };
	inputText.value = '';
	highlightedIndex.value = -1;
	prefillEditedValue();
	focusInput();
}

function selectOperator(operator: FilterOperator) {
	const s = operatorStep.value;
	if (!s)
		return;
	step.value = {
		phase: 'value',
		key: s.key,
		keyLabel: s.keyLabel,
		operator: operator.value,
		operatorLabel: operator.label,
	};
	inputText.value = '';
	highlightedIndex.value = -1;
	prefillEditedValue();
	focusInput();
}

function commitFilter(value: string | string[], valueLabel: string) {
	const s = valueStep.value;
	if (!s)
		return;
	const filter: ActiveFilter = {
		id: editingId.value ?? crypto.randomUUID(),
		key: s.key,
		keyLabel: s.keyLabel,
		operator: s.operator,
		operatorLabel: s.operatorLabel,
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

function definitionOf(filter: ActiveFilter) {
	return props.definitions.find(definition => definition.key === filter.key);
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

function prefillEditedValue() {
	const filter = editingFilter.value;
	const definition = valueDefinition.value;
	if (!filter || !definition || definition.key !== filter.key)
		return;
	const values = [filter.value].flat();
	if (definition.multiSelect)
		selectedValues.value = definition.options?.filter(option => values.includes(option.value)) ?? [];
	else if (!definition.options && !definition.editor)
		inputText.value = values.join(', ');
}

function showEditedKey() {
	const filter = editingFilter.value;
	if (!filter)
		return;
	showStep({ phase: 'key' });
	inputText.value = filter.keyLabel;
	nextTick(() => {
		highlightedIndex.value = filteredDefinitions.value.findIndex(definition => definition.key === filter.key);
	});
}

const pendingEditableSegments = computed<FilterTokenSegment[]>(() => {
	const s = step.value;
	if (s.phase !== 'value')
		return ['key'];
	const operators = valueDefinition.value?.operators ?? [];
	return operators.length > 1 ? ['key', 'operator'] : ['key'];
});

function editPendingSegment(segment: FilterTokenSegment) {
	const s = step.value;
	if (s.phase === 'key')
		return;
	if (segment === 'key')
		showStep({ phase: 'key' });
	else if (segment === 'operator' && s.phase === 'value')
		showStep({ phase: 'operator', key: s.key, keyLabel: s.keyLabel, operators: valueDefinition.value?.operators ?? [] });
	focusInput();
}

function segmentAriaLabel(segment: FilterTokenSegment, keyLabel: string) {
	return segment === 'key'
		? locale.value.filteredSearch.changeKeyButtonAriaLabel(keyLabel)
		: locale.value.filteredSearch.changeOperatorButtonAriaLabel(keyLabel);
}

function editFilter(id: string, segment: FilterTokenSegment) {
	const filter = filters.value.find(existing => existing.id === id);
	const operators = props.definitions.find(definition => definition.key === filter?.key)?.operators ?? [];
	if (!filter || !operators.length)
		return;
	editingId.value = id;
	if (segment === 'key') {
		showEditedKey();
	}
	else if (segment === 'operator' && operators.length > 1) {
		showStep({ phase: 'operator', key: filter.key, keyLabel: filter.keyLabel, operators });
	}
	else {
		showStep({ phase: 'value', key: filter.key, keyLabel: filter.keyLabel, operator: filter.operator, operatorLabel: filter.operatorLabel });
		prefillEditedValue();
	}
	isOpen.value = true;
	focusInput();
}

const hasActiveFilters = computed(() => filters.value.length > 0 || !!searchText.value);

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
	if (s.phase === 'operator') {
		backToKey();
		focusInput();
		return;
	}
	if (s.phase === 'value') {
		const operators = valueDefinition.value?.operators ?? [];
		if (operators.length > 1)
			showStep({ phase: 'operator', key: s.key, keyLabel: s.keyLabel, operators });
		else
			backToKey();
	}
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
		else if (props.searchable && !editingId.value && inputText.value.trim()) {
			searchText.value = inputText.value.trim();
			inputText.value = '';
			isOpen.value = false;
		}
		return;
	}

	if (operatorStep.value) {
		if (highlightedIndex.value >= 0)
			selectOperator(operatorStep.value.operators[highlightedIndex.value]);
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
			highlightedIndex.value = 0;
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
</script>

<template>
	<Popover v-model:open="isOpen">
		<DefineInput>
			<PopoverAnchor v-if="!viewOnly" as-child>
				<input
					ref="inputRef"
					v-model="inputText"
					:placeholder="inputPlaceholder"
					:readonly="step.phase === 'operator'"
					:aria-invalid="valueError ? true : undefined"
					:aria-describedby="valueError ? valueHintId : undefined"
					:size="editingId ? editingInputSize : undefined"
					:class="cn('bg-transparent text-sm outline-none placeholder:text-muted-foreground', editingId ? 'w-auto shrink-0' : 'min-w-20 flex-1', step.phase === 'key' && 'focus:placeholder:text-transparent')"
					@focus="isOpen = true"
					@keydown="handleKeydown"
				>
			</PopoverAnchor>
		</DefineInput>

		<DefineParts #default="{ parts, rounded, editable }">
			<span :class="filterTokenVariants({ rounded })">
				<template v-for="(label, part) in parts" :key="part">
					<button
						v-if="label && editable?.includes(part)"
						type="button"
						:aria-label="segmentAriaLabel(part, parts.key ?? label)"
						:class="filterTokenPartVariants({ part, editable: true })"
						@click="editPendingSegment(part)"
					>
						<span class="truncate">{{ label }}</span>
					</button>
					<span v-else-if="label" :class="filterTokenPartVariants({ part })">
						<span class="truncate">{{ label }}</span>
					</span>
				</template>
			</span>
		</DefineParts>

		<DefineField #default="{ fieldClass }">
			<div
				ref="anchorRef"
				:class="cn(filteredSearchVariants({ wrap, viewOnly }), fieldClass)"
				@click="inputRef?.focus()"
			>
				<div ref="tokenListRef" :class="filteredSearchTokenListVariants({ wrap })">
					<span
						v-if="searchText"
						:class="searchTokenVariants({ removable: !viewOnly })"
					>
						<SearchIcon class="size-3 shrink-0 opacity-60" />
						<span>{{ searchText }}</span>
						<button
							v-if="!viewOnly"
							type="button"
							class="ml-0.5 rounded p-0.5 opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
							:aria-label="locale.filteredSearch.removeSearchButtonAriaLabel"
							@click.stop="searchText = ''"
						>
							<XIcon class="size-3" />
						</button>
					</span>

					<template v-for="filter in filters" :key="filter.id">
						<FilterToken
							v-if="filter.id !== editingId"
							:filter="filter"
							:data-filter-id="filter.id"
							:class="filter.id === draggingId && 'relative z-10 rounded-md bg-background shadow-lg transition-shadow'"
							:removable="!viewOnly"
							:editable="!viewOnly"
							:draggable="draggable && !viewOnly"
							@remove="removeFilter"
							@edit="editFilter"
							@drag-start="startDrag($event, filter.id)"
						>
							<template v-if="definitionOf(filter)?.renderValue" #value>
								<RenderNode :node="renderValue(filter)" />
							</template>
						</FilterToken>
						<template v-else>
							<ReuseParts v-if="pendingParts" :parts="pendingParts" rounded="start" :editable="pendingEditableSegments" />
							<ReuseInput />
							<ReuseParts v-if="editedRest" :parts="editedRest" rounded="end" />
						</template>
					</template>

					<template v-if="!editingId">
						<ReuseParts v-if="pendingParts" :parts="pendingParts" rounded="start" :editable="pendingEditableSegments" />
						<ReuseInput />
					</template>
				</div>

				<slot name="suffix" />

				<Button
					v-if="hasActiveFilters && !viewOnly"
					variant="ghost"
					size="icon-sm"
					class="my-1 ml-1 size-7 shrink-0"
					:aria-label="locale.filteredSearch.clearButtonAriaLabel"
					@click.stop="clearAll"
				>
					<CircleXIcon class="size-4" />
				</Button>

				<SearchIcon v-else-if="!viewOnly" class="ml-1 size-4 shrink-0 text-muted-foreground" />
			</div>
		</DefineField>

		<ButtonGroup v-if="historyItems && !viewOnly" :class="cn('w-full', props.class)">
			<FilterHistory
				:items="historyItems"
				@select="selectHistoryItem"
				@clear="emit('clearHistory')"
			/>
			<ReuseField field-class="min-w-0 flex-1" />
		</ButtonGroup>
		<ReuseField v-else :field-class="props.class" />

		<PopoverContent
			v-if="!viewOnly"
			class="min-w-70 overflow-hidden p-0"
			align="start"
			:side-offset="12"
			@open-auto-focus="(e: Event) => e.preventDefault()"
			@pointer-down-outside="preventCloseOnAnchorInteract"
			@focus-outside="preventCloseOnAnchorInteract"
		>
			<div v-if="stepLabel" class="flex items-center gap-1.5 border-b px-3 py-2">
				<button
					type="button"
					class="-ml-0.5 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					:aria-label="locale.filteredSearch.backButtonAriaLabel"
					@click="goBack"
				>
					<ChevronLeftIcon class="size-4" />
				</button>
				<span class="text-xs text-muted-foreground">{{ stepLabel }}</span>
			</div>

			<div v-if="step.phase === 'key'" role="listbox" class="max-h-60 overflow-y-auto py-1" @mouseleave="highlightedIndex = -1">
				<p v-if="filteredDefinitions.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
					{{ locale.filteredSearch.emptyText }}
				</p>
				<button
					v-for="(definition, index) in filteredDefinitions"
					:key="definition.key"
					type="button"
					role="option"
					:aria-selected="index === highlightedIndex"
					:class="cn(
						'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
						index === highlightedIndex
							? 'bg-accent text-accent-foreground'
							: 'hover:bg-accent hover:text-accent-foreground',
					)"
					@click="selectKey(definition)"
					@mouseenter="highlightedIndex = index"
				>
					<component :is="definition.icon" v-if="definition.icon" class="size-3.5 shrink-0 text-muted-foreground" />
					{{ definition.label }}
				</button>
			</div>

			<div v-else-if="operatorStep" role="listbox" class="py-1" @mouseleave="highlightedIndex = -1">
				<button
					v-for="(operator, index) in operatorStep.operators"
					:key="operator.value"
					type="button"
					role="option"
					:aria-selected="index === highlightedIndex"
					:class="cn(
						'w-full px-3 py-1.5 text-left text-sm transition-colors',
						index === highlightedIndex
							? 'bg-accent text-accent-foreground'
							: 'hover:bg-accent hover:text-accent-foreground',
					)"
					@click="selectOperator(operator)"
					@mouseenter="highlightedIndex = index"
				>
					{{ operator.label }}
				</button>
			</div>

			<component
				:is="valueDefinition.editor"
				v-else-if="valueDefinition?.editor && valueOperator"
				:definition="valueDefinition"
				:operator="valueOperator"
				:search="inputText"
				@submit="confirmValue"
			/>

			<template v-else-if="suggestsOptions">
				<div role="listbox" class="max-h-60 overflow-y-auto py-1" @mouseleave="highlightedIndex = -1">
					<p v-if="valueOptions.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
						{{ locale.filteredSearch.emptyText }}
					</p>
					<button
						v-for="(option, index) in valueOptions"
						:key="option.value"
						type="button"
						role="option"
						:aria-selected="index === highlightedIndex"
						:class="cn(
							'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
							index === highlightedIndex
								? 'bg-accent text-accent-foreground'
								: 'hover:bg-accent hover:text-accent-foreground',
						)"
						@click="chooseValue(option)"
						@mouseenter="highlightedIndex = index"
					>
						<CheckIcon v-if="isMultiSelect" :class="cn('size-3.5 shrink-0', isSelected(option) ? 'opacity-100' : 'opacity-0')" />
						<RenderNode v-if="valueDefinition?.renderOption" :node="valueDefinition.renderOption(option)" />
						<template v-else>
							{{ option.label }}
						</template>
					</button>
				</div>

				<div v-if="isMultiSelect" class="border-t p-1">
					<Button
						variant="ghost"
						size="sm"
						class="w-full justify-start"
						:disabled="selectedValues.length === 0"
						@click="applySelectedValues"
					>
						{{ locale.filteredSearch.applyButtonText }}
					</Button>
				</div>
			</template>

			<div v-else-if="valueStep" class="px-3 py-2">
				<p :id="valueHintId" :class="valueHintVariants({ invalid: !!valueError })">
					{{ valueError ?? locale.filteredSearch.valueHintText }}
				</p>
			</div>
		</PopoverContent>
	</Popover>
</template>
