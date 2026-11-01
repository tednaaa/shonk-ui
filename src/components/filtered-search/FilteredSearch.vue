<script setup lang="ts">
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { ActiveFilter, FilterDefinition, FilterHistoryItem } from './types';
import type { ShonkLocale } from '@/locales';
import { CircleXIcon, SearchIcon, XIcon } from '@lucide/vue';
import { createReusableTemplate } from '@vueuse/core';
import { computed, provide, ref } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Button } from '../button';
import { ButtonGroup } from '../button-group';
import { Popover, PopoverAnchor, PopoverContent } from '../popover';
import { filteredSearchKey } from './lib/context';
import { useFilteredSearch } from './lib/useFilteredSearch';
import { useTokenDrag } from './lib/useTokenDrag';
import FilterDraft from './ui/FilterDraft.vue';
import FilterDropdown from './ui/FilterDropdown.vue';
import FilterHistory from './ui/FilterHistory.vue';
import FilterToken from './ui/FilterToken.vue';
import { RenderNode } from './ui/RenderNode';
import { filteredSearchTokenListVariants, filteredSearchVariants, searchTokenVariants } from './variants';

const props = withDefaults(defineProps<{
	definitions: FilterDefinition[];
	historyItems?: FilterHistoryItem[];
	searchable?: boolean;
	draggable?: boolean;
	viewOnly?: boolean;
	wrap?: boolean;
	class?: HTMLAttributes['class'];
	locale?: Partial<ShonkLocale['filteredSearch']>;
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

const locale = useLocale(() => ({ filteredSearch: props.locale }));

const search = useFilteredSearch({
	definitions: () => props.definitions,
	searchable: () => props.searchable,
	filters,
	searchText,
});
provide(filteredSearchKey, search);

const {
	isOpen,
	step,
	inputText,
	inputRef,
	isEditedKeyUntouched,
	editingId,
	valueError,
	valueHintId,
	pendingParts,
	editedRest,
	pendingEditableSegments,
	hasActiveFilters,
	definitionOf,
	renderValue,
	removeFilter,
	editPendingSegment,
	editFilter,
	clearAll,
	selectHistoryItem,
	handleKeydown,
} = search;

const [DefineField, ReuseField] = createReusableTemplate<{ fieldClass?: HTMLAttributes['class'] }>();
const [DefineInput, ReuseInput] = createReusableTemplate();

const anchorRef = ref<HTMLElement | null>(null);
const tokenListRef = ref<HTMLElement | null>(null);

const { draggingId, startDrag } = useTokenDrag({
	enabled: () => props.draggable && !props.viewOnly && !editingId.value,
	vertical: () => props.wrap,
	list: tokenListRef,
	filters,
});

function preventCloseOnAnchorInteract(e: PointerDownOutsideEvent | FocusOutsideEvent) {
	const { target } = e.detail.originalEvent;
	if (target instanceof Node && anchorRef.value?.contains(target))
		e.preventDefault();
}

const inputPlaceholder = computed(() => {
	if (step.value.phase === 'value')
		return locale.value.filteredSearch.enterValuePlaceholder;
	if (step.value.phase === 'operator')
		return locale.value.filteredSearch.selectOperatorPlaceholder;
	if (filters.value.length > 0 || searchText.value)
		return locale.value.filteredSearch.addFilterPlaceholder;
	return locale.value.filteredSearch.placeholder;
});

const editingInputSize = computed(() => Math.max(inputText.value.length, step.value.phase === 'key' ? 1 : inputPlaceholder.value.length));
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
					@input="isEditedKeyUntouched = false"
					@keydown="handleKeydown"
				>
			</PopoverAnchor>
		</DefineInput>

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
							<FilterDraft v-if="pendingParts" :parts="pendingParts" rounded="start" :editable="pendingEditableSegments" @edit="editPendingSegment" />
							<ReuseInput />
							<FilterDraft v-if="editedRest" :parts="editedRest" rounded="end" />
						</template>
					</template>

					<template v-if="!editingId">
						<FilterDraft v-if="pendingParts" :parts="pendingParts" rounded="start" :editable="pendingEditableSegments" @edit="editPendingSegment" />
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
			<FilterDropdown />
		</PopoverContent>
	</Popover>
</template>
