<script setup lang="ts" generic="TData extends object">
import type { Column } from '@tanstack/vue-table';
import type { AcceptableValue, PopoverContentProps } from 'reka-ui';
import type { VNodeChild } from 'vue';
import type { KitFeatures } from '../core/features';
import type { DataTableInstance } from '../types';
import type { ShonkLocale } from '@/locales';
import { Columns3Icon } from '@lucide/vue';
import { computed } from 'vue';
import { useLocale } from '@/locales';
import { Button } from '../../button';
import { Checkbox } from '../../checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../command';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';
import { useCardFields } from '../cards/useCardFields';
import { unwrapCards, unwrapDataTable } from '../core/instance';

const props = withDefaults(defineProps<{
	table: DataTableInstance<TData>;
	align?: PopoverContentProps['align'];
	locale?: Partial<ShonkLocale['dataTable']>;
}>(), {
	align: 'end',
});

defineSlots<{
	trigger?: () => VNodeChild;
}>();

const open = defineModel<boolean>('open', { default: false });

const locale = useLocale(() => ({ dataTable: props.locale }));

const kitTable = computed(() => unwrapDataTable(props.table));

const cards = computed(() => unwrapCards(props.table));

const cardFields = useCardFields(() => kitTable.value, () => cards.value);

const cardsMode = computed(() => cards.value.active.value);

const hideableColumns = computed(() => (cardsMode.value
	? cardFields.fieldColumns.value
	: kitTable.value.getAllLeafColumns().filter(column => column.getCanHide())));

const visibleColumnIds = computed(() => (cardsMode.value
	? cardFields.selectedIds.value
	: hideableColumns.value.filter(column => column.getIsVisible()).map(column => column.id)));

const allColumnsVisible = computed(() => visibleColumnIds.value.length === hideableColumns.value.length);

function columnLabel(column: Column<KitFeatures, TData>) {
	return column.columnDef.meta?.label ?? column.id;
}

function isColumnVisible(column: Column<KitFeatures, TData>) {
	return visibleColumnIds.value.includes(column.id);
}

function isLastVisibleColumn(column: Column<KitFeatures, TData>) {
	return visibleColumnIds.value.length === 1 && isColumnVisible(column);
}

function showOnlyColumns(columnIds: AcceptableValue) {
	const visibleIds = Array.isArray(columnIds) ? columnIds : [];

	if (cardsMode.value) {
		cardFields.select(visibleIds.map(String));
		return;
	}

	kitTable.value.setColumnVisibility(visibility => ({
		...visibility,
		...Object.fromEntries(hideableColumns.value.map(column => [column.id, visibleIds.includes(column.id)])),
	}));
}

function toggleAllColumns() {
	const columns = allColumnsVisible.value ? hideableColumns.value.slice(0, 1) : hideableColumns.value;
	showOnlyColumns(columns.map(column => column.id));
}
</script>

<template>
	<Popover v-model:open="open">
		<PopoverTrigger as-child>
			<slot name="trigger">
				<Button variant="secondary">
					<Columns3Icon />
					{{ cardsMode ? locale.dataTable.columnToggleCardsButtonText : locale.dataTable.columnToggleButtonText }}
				</Button>
			</slot>
		</PopoverTrigger>

		<PopoverContent
			:align="align"
			class="w-64 p-0"
		>
			<Command
				:model-value="visibleColumnIds"
				multiple
				highlight-on-hover
				@update:model-value="showOnlyColumns"
			>
				<CommandInput :placeholder="locale.dataTable.columnToggleSearchPlaceholder" />
				<CommandList>
					<CommandEmpty>{{ locale.dataTable.columnToggleEmptyText }}</CommandEmpty>
					<CommandGroup>
						<CommandItem
							v-for="column in hideableColumns"
							:key="column.id"
							:value="column.id"
							:disabled="isLastVisibleColumn(column)"
						>
							<Checkbox
								:model-value="isColumnVisible(column)"
								tabindex="-1"
								aria-hidden="true"
								class="pointer-events-none"
							/>
							{{ columnLabel(column) }}
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>

			<div class="flex items-center justify-between gap-2 border-t py-1 pr-1 pl-3">
				<span class="text-xs text-muted-foreground tabular-nums">
					{{ locale.dataTable.columnToggleVisibleCountText(visibleColumnIds.length, hideableColumns.length) }}
				</span>
				<Button
					variant="ghost"
					size="sm"
					@click="toggleAllColumns"
				>
					{{ allColumnsVisible ? locale.dataTable.columnToggleHideAllButtonText : locale.dataTable.columnToggleShowAllButtonText }}
				</Button>
			</div>
		</PopoverContent>
	</Popover>
</template>
