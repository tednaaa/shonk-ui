<script setup lang="ts" generic="TData extends object">
import type { ComponentPublicInstance, HTMLAttributes, VNodeChild } from 'vue';
import type { KitTable } from '../core/features';
import type { DataTableCardsState } from '../core/instance';
import type { DataTableCellContext } from '../types';
import { useElementSize, useElementVisibility } from '@vueuse/core';
import { computed, useSlots, useTemplateRef, watch } from 'vue';
import { useLocale } from '@/locales';
import { cn } from '@/utils';
import { Spinner } from '../../spinner';
import { provideCards } from './cardsContext';
import DataTableCard from './DataTableCard.vue';
import DataTableCardsItem from './DataTableCardsItem.vue';
import DataTableSort from './DataTableSort.vue';
import { useCardFields } from './useCardFields';

const props = defineProps<{
	table: KitTable<TData>;
	cards: DataTableCardsState;
	class?: HTMLAttributes['class'];
	rowClass?: (row: TData) => HTMLAttributes['class'];
	loading?: boolean;
	hasNextPage?: boolean;
	loadingMore?: boolean;
	onRowClick?: (row: TData) => void;
}>();

const emit = defineEmits<{
	loadMore: [];
}>();

defineSlots<{
	[name: `cell-${string}`]: ((context: DataTableCellContext<TData>) => VNodeChild) | undefined;
	card?: (context: { row: TData }) => VNodeChild;
	expanded?: (context: { row: TData }) => VNodeChild;
	empty?: () => VNodeChild;
}>();

const locale = useLocale();

const { slots: cardSlots, shownIds } = useCardFields(() => props.table, () => props.cards);

const sorting = computed(() => props.table.atoms.sorting.get());

provideCards({
	slotOf: columnId => cardSlots.value.get(columnId),
	shownFieldIds: shownIds,
	fieldLimit: computed(() => props.cards.fieldLimit.value),
	sortOf: columnId => sorting.value.find(sort => sort.id === columnId),
	slots: useSlots(),
});

const rows = computed(() => [...props.table.getTopRows(), ...props.table.getCenterRows(), ...props.table.getBottomRows()]);

const sortable = computed(() => props.table.getAllLeafColumns().some(column => column.getCanSort()));

const sortBar = useTemplateRef<ComponentPublicInstance>('sortBar');

const { height: sortBarHeight } = useElementSize(sortBar, undefined, { box: 'border-box' });

const sentinel = useTemplateRef('sentinel');

const sentinelVisible = useElementVisibility(sentinel, { rootMargin: '100px' });

watch(
	() => sentinelVisible.value && props.hasNextPage && !props.loading && !props.loadingMore,
	(canLoadMore) => {
		if (canLoadMore)
			emit('loadMore');
	},
	{ immediate: true },
);
</script>

<template>
	<div
		data-slot="data-table-cards"
		:class="cn('flex flex-col gap-3', props.class)"
		:style="{ '--data-table-sort-height': `${sortBarHeight}px` }"
		:aria-busy="loading || loadingMore"
	>
		<DataTableSort
			v-if="sortable"
			ref="sortBar"
			:table="table"
		/>

		<ul
			v-if="rows.length > 0"
			:class="cn('divide-y', sortable ? 'border-b' : 'border-y', loading && 'pointer-events-none opacity-50')"
		>
			<DataTableCardsItem
				v-for="row in rows"
				:key="row.id"
				:row="row"
				:row-class="rowClass"
				:on-row-click="onRowClick"
			>
				<slot
					name="card"
					:row="row.original"
				>
					<DataTableCard />
				</slot>
				<div
					v-if="$slots.expanded && row.getIsExpanded() && row.getCanExpand()"
					class="mt-2 rounded-md bg-secondary p-3"
				>
					<slot
						name="expanded"
						:row="row.original"
					/>
				</div>
			</DataTableCardsItem>
		</ul>

		<div
			v-else
			class="flex min-h-24 items-center justify-center py-6 text-center text-sm text-muted-foreground"
		>
			<Spinner v-if="loading" />
			<slot
				v-else
				name="empty"
			>
				{{ locale.dataTable.emptyText }}
			</slot>
		</div>

		<Spinner
			v-if="loadingMore"
			class="mx-auto"
		/>

		<div
			ref="sentinel"
			aria-hidden="true"
		/>
	</div>
</template>
