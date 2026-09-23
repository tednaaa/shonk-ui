<script setup lang="ts">
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ActiveFilter, FilterDefinition, FilterHistoryItem, FilterOperator, FilterOption } from './types';
import { CheckIcon, ChevronLeftIcon, CircleXIcon, HistoryIcon, SearchIcon, XIcon } from '@lucide/vue';
import { computed, nextTick, ref, watch } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../popover';
import FilterToken from './FilterToken.vue';

const props = withDefaults(defineProps<{
  definitions: FilterDefinition[];
  historyItems?: FilterHistoryItem[];
  placeholder?: string;
  searchable?: boolean;
  viewOnly?: boolean;
  wrap?: boolean;
  class?: HTMLAttributes['class'];
}>(), {
  searchable: true,
  viewOnly: false,
  wrap: false,
});

const emit = defineEmits<{ clearHistory: [] }>();

defineSlots<{
  suffix?: () => unknown;
}>();

const filters = defineModel<ActiveFilter[]>('filters', { default: () => [] });
const searchText = defineModel<string>('searchText', { default: '' });

type DropdownStep
  = | { phase: 'key' }
    | { phase: 'operator'; key: string; keyLabel: string; operators: FilterOperator[] }
    | { phase: 'value'; key: string; keyLabel: string; operator: string; operatorLabel: string };

const locale = useLocale();

const isOpen = ref(false);
const isHistoryOpen = ref(false);
const step = ref<DropdownStep>({ phase: 'key' });
const inputText = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const anchorRef = ref<HTMLElement | null>(null);
const highlightedIndex = ref(-1);
const selectedValues = ref<FilterOption[]>([]);

function preventCloseOnAnchorInteract(e: PointerDownOutsideEvent | FocusOutsideEvent) {
  const { target } = e.detail.originalEvent;
  if (target instanceof Node && anchorRef.value?.contains(target))
    e.preventDefault();
}

const operatorStep = computed(() => step.value.phase === 'operator' ? step.value : null);
const valueStep = computed(() => step.value.phase === 'value' ? step.value : null);

const availableDefinitions = computed(() => props.definitions.filter(definition =>
  !definition.unique || !filters.value.some(filter => filter.key === definition.key),
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

const inputPlaceholder = computed(() => {
  if (step.value.phase === 'value')
    return locale.value.filteredSearch.enterValuePlaceholder;
  if (step.value.phase === 'operator')
    return locale.value.filteredSearch.selectOperatorPlaceholder;
  if (filters.value.length > 0 || searchText.value)
    return locale.value.filteredSearch.addFilterPlaceholder;
  return props.placeholder ?? locale.value.filteredSearch.placeholder;
});

function focusInput() {
  nextTick(() => inputRef.value?.focus());
}

function resetToKeyPhase() {
  step.value = { phase: 'key' };
  inputText.value = '';
  highlightedIndex.value = -1;
  selectedValues.value = [];
}

function selectKey(definition: FilterDefinition) {
  const [only] = definition.operators;
  step.value = definition.operators.length === 1
    ? { phase: 'value', key: definition.key, keyLabel: definition.label, operator: only.value, operatorLabel: only.label }
    : { phase: 'operator', key: definition.key, keyLabel: definition.label, operators: definition.operators };
  inputText.value = '';
  highlightedIndex.value = -1;
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
  focusInput();
}

function commitFilter(value: string | string[], valueLabel: string) {
  const s = valueStep.value;
  if (!s)
    return;
  filters.value = [
    ...filters.value,
    {
      id: crypto.randomUUID(),
      key: s.key,
      keyLabel: s.keyLabel,
      operator: s.operator,
      operatorLabel: s.operatorLabel,
      value,
      valueLabel,
    },
  ];
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
  commitFilter(typed, typed);
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

const hasActiveFilters = computed(() => filters.value.length > 0 || !!searchText.value);

function clearAll() {
  filters.value = [];
  searchText.value = '';
  resetToKeyPhase();
}

function historyItemLabel(item: FilterHistoryItem) {
  const tokens = item.filters.map(filter => `${filter.keyLabel} ${filter.operatorLabel} ${filter.valueLabel}`);
  return [...tokens, item.searchText].filter(Boolean).join(' ');
}

function selectHistoryItem(item: FilterHistoryItem) {
  filters.value = item.filters.map(filter => ({ ...filter, id: crypto.randomUUID() }));
  searchText.value = item.searchText ?? '';
  isHistoryOpen.value = false;
  resetToKeyPhase();
}

function clearHistory() {
  isHistoryOpen.value = false;
  emit('clearHistory');
}

function goBack() {
  const s = step.value;
  if (s.phase === 'operator') {
    resetToKeyPhase();
    focusInput();
    return;
  }
  if (s.phase === 'value') {
    const operators = valueDefinition.value?.operators ?? [];
    const back: DropdownStep = operators.length > 1
      ? { phase: 'operator', key: s.key, keyLabel: s.keyLabel, operators }
      : { phase: 'key' };
    resetToKeyPhase();
    step.value = back;
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
    else if (props.searchable && inputText.value.trim()) {
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
  if (filters.value.length > 0)
    filters.value = filters.value.slice(0, -1);
  else if (searchText.value)
    searchText.value = '';
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
    <div
      ref="anchorRef"
      :class="cn(
        'flex items-center gap-1.5 w-full overflow-hidden rounded-md border border-border bg-background px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none',
        wrap ? 'min-h-10 py-1' : 'h-10',
        viewOnly ? 'text-muted-foreground' : 'cursor-text',
        isOpen && 'border-ring ring-ring/50 ring-[3px]',
        !viewOnly && !isOpen && 'hover:border-ring/50',
        props.class,
      )"
      @click="inputRef?.focus()"
    >
      <div
        :class="cn(
          'flex items-center gap-1.5 flex-1 min-w-0',
          wrap ? 'flex-wrap' : 'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )"
      >
        <span
          v-if="searchText"
          class="inline-flex items-center gap-1 rounded-md border border-border bg-accent/50 text-accent-foreground text-xs h-6 pl-1.5 shrink-0"
          :class="viewOnly ? 'pr-1.5' : 'pr-1'"
        >
          <SearchIcon class="size-3 shrink-0 opacity-60" />
          <span>{{ searchText }}</span>
          <button
            v-if="!viewOnly"
            class="ml-0.5 rounded p-0.5 opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            :aria-label="locale.filteredSearch.removeSearchButtonAriaLabel"
            @click.stop="searchText = ''"
          >
            <XIcon class="size-3" />
          </button>
        </span>

        <FilterToken
          v-for="filter in filters"
          :key="filter.id"
          :filter="filter"
          :removable="!viewOnly"
          @remove="removeFilter"
        />

        <span
          v-if="stepLabel"
          class="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 shrink-0"
        >
          {{ stepLabel }}
        </span>

        <PopoverAnchor v-if="!viewOnly" as-child>
          <input
            ref="inputRef"
            v-model="inputText"
            :placeholder="inputPlaceholder"
            :readonly="step.phase === 'operator'"
            class="flex-1 min-w-20 outline-none bg-transparent placeholder:text-muted-foreground text-sm"
            @focus="isOpen = true"
            @keydown="handleKeydown"
          >
        </PopoverAnchor>
      </div>

      <slot name="suffix" />

      <Popover v-if="historyItems && !viewOnly" v-model:open="isHistoryOpen">
        <PopoverTrigger as-child>
          <Button
            variant="ghost"
            size="icon-sm"
            class="my-1 h-7 w-7 shrink-0"
            :aria-label="locale.filteredSearch.historyButtonAriaLabel"
            @click.stop
          >
            <HistoryIcon class="size-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent class="p-0 overflow-hidden min-w-70" align="end" :side-offset="12">
          <p class="border-b px-3 py-2 text-xs text-muted-foreground">
            {{ locale.filteredSearch.historyHeaderText }}
          </p>

          <p v-if="historyItems.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
            {{ locale.filteredSearch.historyEmptyText }}
          </p>

          <div v-else class="py-1 max-h-60 overflow-y-auto">
            <button
              v-for="(item, index) in historyItems"
              :key="index"
              class="w-full text-left px-3 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
              :aria-label="locale.filteredSearch.historyItemAriaLabel(historyItemLabel(item))"
              @click="selectHistoryItem(item)"
            >
              <span class="flex flex-wrap items-center gap-1.5">
                <FilterToken
                  v-for="filter in item.filters"
                  :key="filter.id"
                  :filter="filter"
                  :removable="false"
                />
                <span v-if="item.searchText" class="text-sm">{{ item.searchText }}</span>
              </span>
            </button>
          </div>

          <div v-if="historyItems.length > 0" class="border-t p-1">
            <Button variant="ghost" size="sm" class="w-full justify-start" @click="clearHistory">
              {{ locale.filteredSearch.clearHistoryButtonText }}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        v-if="hasActiveFilters && !viewOnly"
        variant="ghost"
        size="icon-sm"
        class="ml-1 my-1 h-7 w-7 shrink-0"
        :aria-label="locale.filteredSearch.clearButtonAriaLabel"
        @click.stop="clearAll"
      >
        <CircleXIcon class="size-4" />
      </Button>

      <SearchIcon v-else-if="!viewOnly" class="size-4 text-muted-foreground shrink-0 ml-1" />
    </div>

    <PopoverContent
      v-if="!viewOnly"
      class="p-0 overflow-hidden min-w-70"
      align="start"
      :side-offset="12"
      @open-auto-focus="(e: Event) => e.preventDefault()"
      @pointer-down-outside="preventCloseOnAnchorInteract"
      @focus-outside="preventCloseOnAnchorInteract"
    >
      <div v-if="stepLabel" class="flex items-center gap-1.5 border-b px-3 py-2">
        <button
          class="rounded p-0.5 -ml-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          :aria-label="locale.filteredSearch.backButtonAriaLabel"
          @click="goBack"
        >
          <ChevronLeftIcon class="size-4" />
        </button>
        <span class="text-xs text-muted-foreground">{{ stepLabel }}</span>
      </div>

      <div v-if="step.phase === 'key'" role="listbox" class="py-1 max-h-60 overflow-y-auto" @mouseleave="highlightedIndex = -1">
        <p v-if="filteredDefinitions.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
          {{ locale.filteredSearch.emptyText }}
        </p>
        <button
          v-for="(definition, index) in filteredDefinitions"
          :key="definition.key"
          role="option"
          :aria-selected="index === highlightedIndex"
          :class="cn(
            'w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2',
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
          role="option"
          :aria-selected="index === highlightedIndex"
          :class="cn(
            'w-full text-left px-3 py-1.5 text-sm transition-colors',
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
        <div role="listbox" class="py-1 max-h-60 overflow-y-auto" @mouseleave="highlightedIndex = -1">
          <p v-if="valueOptions.length === 0" class="px-3 py-2 text-sm text-muted-foreground">
            {{ locale.filteredSearch.emptyText }}
          </p>
          <button
            v-for="(option, index) in valueOptions"
            :key="option.value"
            role="option"
            :aria-selected="index === highlightedIndex"
            :class="cn(
              'w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2',
              index === highlightedIndex
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-accent hover:text-accent-foreground',
            )"
            @click="chooseValue(option)"
            @mouseenter="highlightedIndex = index"
          >
            <CheckIcon v-if="isMultiSelect" :class="cn('size-3.5 shrink-0', isSelected(option) ? 'opacity-100' : 'opacity-0')" />
            {{ option.label }}
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
        <p class="text-xs text-muted-foreground">
          {{ locale.filteredSearch.valueHintText }}
        </p>
      </div>
    </PopoverContent>
  </Popover>
</template>
