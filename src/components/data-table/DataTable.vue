<script setup lang="ts" generic="TData extends object">
import type { HTMLAttributes, VNodeChild } from 'vue';
import type { DataTableCardsBreakpoint, DataTableCellContext, DataTableHeaderContext, DataTableInstance } from './types';
import type { ShonkLocale } from '@/locales';
import { unrefElement, useInfiniteScroll, useMediaQuery } from '@vueuse/core';
import { computed, onBeforeUnmount, useTemplateRef, watchEffect } from 'vue';
import { provideLocale } from '@/locales';
import { cn } from '@/utils';
import { Table } from '../table';
import { defaultCardFieldLimit } from './cards/cards';
import DataTableCards from './cards/DataTableCards.vue';
import { useColumnSizing } from './column-sizing/columnSizing';
import { unwrapCards, unwrapDataTable } from './core/instance';
import { useColumnPinning } from './pinning/columnPinning';
import { useRowPinning } from './pinning/rowPinning';
import DataTableBody from './table/DataTableBody.vue';
import DataTableFooter from './table/DataTableFooter.vue';
import DataTableHeader from './table/DataTableHeader.vue';

const props = defineProps<{
	table: DataTableInstance<TData>;
	class?: HTMLAttributes['class'];
	rowClass?: (row: TData) => HTMLAttributes['class'];
	loading?: boolean;
	hasNextPage?: boolean;
	loadingMore?: boolean;
	onRowClick?: (row: TData) => void;
	locale?: Partial<ShonkLocale['dataTable']>;
	cardsBelow?: DataTableCardsBreakpoint;
	cardFields?: number;
}>();

const emit = defineEmits<{
	loadMore: [];
}>();

const slots = defineSlots<{
	[name: `cell-${string}`]: ((context: DataTableCellContext<TData>) => VNodeChild) | undefined;
	[name: `header-${string}`]: ((context: DataTableHeaderContext) => VNodeChild) | undefined;
	card?: (context: { row: TData }) => VNodeChild;
	expanded?: (context: { row: TData }) => VNodeChild;
	empty?: () => VNodeChild;
}>();

provideLocale(() => ({ dataTable: props.locale }));

const kitTable = computed(() => unwrapDataTable(props.table));

const cards = computed(() => unwrapCards(props.table));

const breakpoints: Record<DataTableCardsBreakpoint, string> = { 'sm': '40rem', 'md': '48rem', 'lg': '64rem', 'xl': '80rem', '2xl': '96rem' };

const belowBreakpoint = useMediaQuery(() => (props.cardsBelow === undefined ? 'not all' : `(width < ${breakpoints[props.cardsBelow]})`));

const showCards = computed(() => props.cardsBelow !== undefined && belowBreakpoint.value);

watchEffect(() => {
	cards.value.active.value = showCards.value;
	cards.value.fieldLimit.value = props.cardFields ?? defaultCardFieldLimit;
});

onBeforeUnmount(() => {
	cards.value.active.value = false;
});

const { enabled: resizable, columns: sizedColumns, tableAttrs, fixedColumnWidth } = useColumnSizing(kitTable);

useColumnPinning(kitTable, fixedColumnWidth);
useRowPinning();

const scrollTable = useTemplateRef('scrollTable');

useInfiniteScroll(
	() => unrefElement(scrollTable),
	() => emit('loadMore'),
	{
		distance: 100,
		canLoadMore: () => !showCards.value && props.hasNextPage && !props.loading && !props.loadingMore,
	},
);
</script>

<template>
	<DataTableCards
		v-if="showCards"
		:table="kitTable"
		:cards="cards"
		:class="props.class"
		:row-class="rowClass"
		:loading="loading"
		:has-next-page="hasNextPage"
		:loading-more="loadingMore"
		:on-row-click="onRowClick"
		@load-more="emit('loadMore')"
	>
		<template
			v-for="(_, name) in slots"
			#[name]="context"
		>
			<slot
				:name="name"
				v-bind="context"
			/>
		</template>
	</DataTableCards>

	<div
		v-else
		data-slot="data-table"
		:class="cn('flex min-h-0 flex-col overflow-hidden rounded-sm border', props.class)"
	>
		<Table
			ref="scrollTable"
			table-container-class="min-h-0 flex-1"
			:class="tableAttrs?.class"
			:table-style="tableAttrs?.style"
			:aria-busy="loading || loadingMore"
		>
			<colgroup v-if="resizable">
				<col
					v-for="column in sizedColumns"
					:key="column.id"
					:style="column.width === undefined ? undefined : { width: `${column.width}px` }"
				>
			</colgroup>

			<DataTableHeader :table="kitTable">
				<template
					v-for="(_, name) in slots"
					#[name]="context"
				>
					<slot
						:name="name"
						v-bind="context"
					/>
				</template>
			</DataTableHeader>

			<DataTableBody
				:table="kitTable"
				:row-class="rowClass"
				:loading="loading"
				:loading-more="loadingMore"
				:on-row-click="onRowClick"
			>
				<template
					v-for="(_, name) in slots"
					#[name]="context"
				>
					<slot
						:name="name"
						v-bind="context"
					/>
				</template>
			</DataTableBody>

			<DataTableFooter :table="kitTable" />
		</Table>
	</div>
</template>
