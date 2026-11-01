<script setup lang="ts">
import { CheckIcon, ChevronLeftIcon } from '@lucide/vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../../button';
import { checkboxVariants } from '../../checkbox';
import { useFilteredSearchContext } from '../lib/context';
import { valueHintVariants } from '../variants';
import FilterListbox from './FilterListbox.vue';
import FilterListboxOption from './FilterListboxOption.vue';
import { RenderNode } from './RenderNode';

const locale = useLocale();

const {
	step,
	inputText,
	highlightedIndex,
	selectedValues,
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
	selectKey,
	selectOperator,
	confirmValue,
	isSelected,
	chooseValue,
	resetSelectedValues,
	applySelectedValues,
	goBack,
} = useFilteredSearchContext();
</script>

<template>
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

	<FilterListbox v-if="step.phase === 'key'" :empty="filteredDefinitions.length === 0" @mouseleave="highlightedIndex = -1">
		<FilterListboxOption
			v-for="(definition, index) in filteredDefinitions"
			:key="definition.key"
			:highlighted="index === highlightedIndex"
			@click="selectKey(definition)"
			@mouseenter="highlightedIndex = index"
		>
			<component :is="definition.icon" v-if="definition.icon" class="size-3.5 shrink-0 text-muted-foreground" />
			{{ definition.label }}
		</FilterListboxOption>
	</FilterListbox>

	<FilterListbox v-else-if="operatorStep" @mouseleave="highlightedIndex = -1">
		<FilterListboxOption
			v-for="(operator, index) in operatorStep.definition.operators"
			:key="operator.value"
			:highlighted="index === highlightedIndex"
			@click="selectOperator(operator)"
			@mouseenter="highlightedIndex = index"
		>
			{{ operator.label }}
		</FilterListboxOption>
	</FilterListbox>

	<component
		:is="valueStep.definition.editor"
		v-else-if="valueStep?.definition.editor"
		:definition="valueStep.definition"
		:operator="valueStep.operator"
		:search="inputText"
		@submit="confirmValue"
	/>

	<template v-else-if="suggestsOptions">
		<!-- TODO: virtualize the options, 1000 of them take ~150ms to open -->
		<FilterListbox :empty="valueOptions.length === 0" @mouseleave="highlightedIndex = -1">
			<FilterListboxOption
				v-for="(option, index) in valueOptions"
				:key="option.value"
				v-memo="[option, index, index === highlightedIndex, isSelected(option), isMultiSelect, valueDefinition]"
				:highlighted="index === highlightedIndex"
				@click="chooseValue(option)"
				@mouseenter="highlightedIndex = index"
			>
				<span
					v-if="isMultiSelect"
					aria-hidden="true"
					:data-state="isSelected(option) ? 'checked' : 'unchecked'"
					:class="cn(checkboxVariants(), 'grid place-content-center')"
				>
					<CheckIcon v-if="isSelected(option)" class="size-3.5" />
				</span>
				<RenderNode v-if="valueDefinition?.renderOption" :node="valueDefinition.renderOption(option)" />
				<template v-else>
					{{ option.label }}
				</template>
			</FilterListboxOption>
		</FilterListbox>

		<div v-if="isMultiSelect" class="flex items-center gap-2 border-t p-1">
			<Button
				variant="ghost"
				size="sm"
				:disabled="selectedValues.length === 0"
				@click="resetSelectedValues"
			>
				{{ locale.filteredSearch.resetButtonText }}
			</Button>
			<span class="ml-auto text-xs text-muted-foreground tabular-nums">
				{{ locale.filteredSearch.selectedOfTotalText(selectedValues.length, valueDefinition?.options?.length ?? 0) }}
			</span>
			<Button
				size="sm"
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
</template>
