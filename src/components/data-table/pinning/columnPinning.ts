import type { Column } from '@tanstack/vue-table';
import type { ComponentPublicInstance, MaybeRefOrGetter, StyleValue } from 'vue';
import type { KitFeatures, KitTable } from '../core/features';
import { useElementSize } from '@vueuse/core';
import { createContext } from 'reka-ui';
import { computed, ref, toValue, watch } from 'vue';

interface PinnedCellAttrs {
	'data-pinned': '';
	'data-pinned-edge': '' | undefined;
	'style': StyleValue;
}

export const [injectDataTableColumnPinning, provideDataTableColumnPinning] = createContext<{
	pinnedCellAttrs: (columnIds: readonly string[]) => PinnedCellAttrs | undefined;
	setColumnWidth: (columnId: string, width: number) => void;
}>('DataTable');

export function useColumnPinning<TData extends object>(
	table: MaybeRefOrGetter<KitTable<TData>>,
	fixedColumnWidth: (columnId: string) => number | undefined,
) {
	const columnWidths = ref<Record<string, number>>({});

	const startPinnedColumnIds = computed(() => toValue(table).getStartVisibleLeafColumns().map(column => column.id));

	const startOffsets = computed(() => {
		const offsets = new Map<string, number>();
		let offset = 0;

		for (const columnId of startPinnedColumnIds.value) {
			offsets.set(columnId, offset);
			offset += fixedColumnWidth(columnId) ?? columnWidths.value[columnId] ?? 0;
		}

		return offsets;
	});

	function pinnedCellAttrs(columnIds: readonly string[]): PinnedCellAttrs | undefined {
		const [firstColumnId] = columnIds;
		const offset = firstColumnId === undefined ? undefined : startOffsets.value.get(firstColumnId);

		if (offset === undefined || !columnIds.every(columnId => startOffsets.value.has(columnId)))
			return undefined;

		return {
			'data-pinned': '',
			'data-pinned-edge': columnIds.at(-1) === startPinnedColumnIds.value.at(-1) ? '' : undefined,
			'style': { insetInlineStart: `${offset}px` },
		};
	}

	function setColumnWidth(columnId: string, width: number) {
		columnWidths.value[columnId] = width;
	}

	provideDataTableColumnPinning({ pinnedCellAttrs, setColumnWidth });
}

export function usePinnedColumnWidth<TData extends object>(
	column: MaybeRefOrGetter<Column<KitFeatures, TData, unknown>>,
	cell: MaybeRefOrGetter<ComponentPublicInstance | null>,
) {
	const { setColumnWidth } = injectDataTableColumnPinning();

	const pinnedColumnId = computed(() => {
		const headerColumn = toValue(column);

		return headerColumn.getIsPinned() === 'start' ? headerColumn.id : undefined;
	});

	const { width } = useElementSize(() => pinnedColumnId.value === undefined ? undefined : toValue(cell), undefined, { box: 'border-box' });

	watch([pinnedColumnId, width], ([columnId, columnWidth]) => {
		if (columnId)
			setColumnWidth(columnId, columnWidth);
	}, { immediate: true });
}
