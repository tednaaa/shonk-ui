<script setup lang="ts" generic="TData extends object">
import type { Header, SortDirection } from '@tanstack/vue-table';
import type { KitFeatures } from './lib/features';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '@lucide/vue';
import { FlexRender } from '@tanstack/vue-table';
import { computed, useTemplateRef } from 'vue';
import { cn } from '@/utils';
import { TableHead } from '../table';
import DataTableCellContent from './DataTableCellContent.vue';
import DataTableResizeHandle from './DataTableResizeHandle.vue';
import { injectDataTableColumnPinning, usePinnedColumnWidth } from './lib/columnPinning';
import { injectDataTableColumnSizing } from './lib/columnSizing';
import { isInteractiveClick } from './lib/isInteractiveClick';

const props = defineProps<{
	header: Header<KitFeatures, TData, unknown>;
}>();

const ariaSortByDirection: Record<SortDirection, 'ascending' | 'descending'> = {
	asc: 'ascending',
	desc: 'descending',
};

const sortIconByDirection: Record<SortDirection, typeof ArrowUpIcon> = {
	asc: ArrowUpIcon,
	desc: ArrowDownIcon,
};

const label = computed(() => {
	const { columnDef } = props.header.column;

	return typeof columnDef.header === 'string' ? columnDef.header : '';
});

const { pinnedCellAttrs } = injectDataTableColumnPinning();

const { contentStyle, registerHeadCell } = injectDataTableColumnSizing();

const pinnedCell = computed(() => pinnedCellAttrs(
	props.header.getLeafHeaders()
		.filter(leafHeader => leafHeader.subHeaders.length === 0)
		.map(leafHeader => leafHeader.column.id),
));

const headCell = useTemplateRef('headCell');

usePinnedColumnWidth(() => props.header.column, headCell);

if (props.header.column.columns.length === 0)
	registerHeadCell(props.header.column.id, headCell);

const resizable = computed(() => props.header.column.columns.length === 0 && props.header.column.getCanResize());

const labelStyle = computed(() => resizable.value ? contentStyle(props.header.column.id) : undefined);

const headCellClass = computed(() => cn(
	'shadow-[inset_0_-1px_0_var(--border)]',
	resizable.value && 'relative',
	props.header.column.columnDef.meta?.headerClass,
	pinnedCell.value?.class,
));

const sortable = computed(() => props.header.column.getCanSort());

const direction = computed(() => props.header.column.getIsSorted());

const sortPosition = computed(() => {
	const sortedColumnCount = props.header.getContext().table.atoms.sorting.get().length;
	const sortIndex = props.header.column.getSortIndex();

	return sortedColumnCount > 1 && sortIndex >= 0 ? sortIndex + 1 : undefined;
});

let resizeStarted = false;

function toggleSorting(event: MouseEvent | KeyboardEvent) {
	props.header.column.toggleSorting(undefined, event.shiftKey);
}

function handleMouseDown() {
	resizeStarted = false;
}

function handleResizeStart() {
	resizeStarted = true;
}

function handleClick(event: MouseEvent) {
	if (sortable.value && !resizeStarted && !isInteractiveClick(event))
		toggleSorting(event);
}
</script>

<template>
	<TableHead
		v-if="sortable"
		ref="headCell"
		:colspan="header.colSpan"
		:rowspan="header.rowSpan"
		:aria-sort="direction ? ariaSortByDirection[direction] : 'none'"
		tabindex="0"
		:class="cn('cursor-pointer outline-none select-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset', headCellClass)"
		:style="pinnedCell?.style"
		@mousedown="handleMouseDown"
		@click="handleClick"
		@keydown.enter.self.prevent="toggleSorting"
		@keydown.space.self.prevent="toggleSorting"
	>
		<span
			class="inline-flex max-w-full items-center gap-1.5"
			:style="labelStyle"
		>
			<span :class="resizable && 'truncate'">
				<slot
					:name="`header-${header.column.id}`"
					:label="label"
				>
					<FlexRender :header="header" />
				</slot>
			</span>
			<span
				aria-hidden="true"
				:class="cn('inline-flex shrink-0 items-center gap-0.5 text-xs tabular-nums', direction ? 'text-foreground' : 'text-muted-foreground')"
			>
				<component
					:is="direction ? sortIconByDirection[direction] : ArrowUpDownIcon"
					class="size-3.5"
				/>
				{{ sortPosition }}
			</span>
		</span>
		<DataTableResizeHandle
			v-if="resizable"
			:header="header"
			@resize-start="handleResizeStart"
		/>
	</TableHead>
	<TableHead
		v-else
		ref="headCell"
		:colspan="header.colSpan"
		:rowspan="header.rowSpan"
		:class="headCellClass"
		:style="pinnedCell?.style"
	>
		<DataTableCellContent :column="header.column">
			<slot
				:name="`header-${header.column.id}`"
				:label="label"
			>
				<FlexRender :header="header" />
			</slot>
		</DataTableCellContent>
		<DataTableResizeHandle
			v-if="resizable"
			:header="header"
			@resize-start="handleResizeStart"
		/>
	</TableHead>
</template>
