<script setup lang="ts" generic="TData extends object">
import type { Header } from '@tanstack/vue-table';
import type { KitFeatures, KitTable } from '../core/features';
import { FlexRender } from '@tanstack/vue-table';
import { computed, useTemplateRef } from 'vue';
import { cn } from '@/utils';
import { TableCell, TableFooter, TableRow } from '../../table';
import { injectDataTableColumnPinning } from '../pinning/columnPinning';
import { getDisplayedRows, usePinnedRowsInset } from '../pinning/rowPinning';
import DataTableCellContent from './DataTableCellContent.vue';

const props = defineProps<{
	table: KitTable<TData>;
}>();

const { pinnedCellAttrs } = injectDataTableColumnPinning();

function cellAttrs(header: Header<KitFeatures, TData, unknown>) {
	return {
		...pinnedCellAttrs([header.column.id]),
		class: cn('shadow-[inset_0_1px_0_var(--border)]', header.column.columnDef.meta?.class),
	};
}

const leafHeaders = computed(() => props.table.getFooterGroups()[0]?.headers ?? []);

usePinnedRowsInset('bottom', useTemplateRef('footer'));

const visible = computed(() => getDisplayedRows(props.table).length > 0
	&& leafHeaders.value.some(header => header.column.columnDef.footer !== undefined));
</script>

<template>
	<TableFooter
		v-if="visible"
		ref="footer"
		class="sticky bottom-0 z-10 border-t-0 bg-background"
	>
		<TableRow>
			<TableCell
				v-for="header in leafHeaders"
				:key="header.id"
				v-bind="cellAttrs(header)"
			>
				<DataTableCellContent :column="header.column">
					<FlexRender :footer="header" />
				</DataTableCellContent>
			</TableCell>
		</TableRow>
	</TableFooter>
</template>
