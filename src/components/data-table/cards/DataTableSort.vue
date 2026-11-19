<script setup lang="ts" generic="TData extends object">
import type { Column } from '@tanstack/vue-table';
import type { KitFeatures, KitTable } from '../core/features';
import type { DataTableSortingState } from '../types';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, PlusIcon, XIcon } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { useLocale } from '@/locales';
import { Badge } from '../../badge';
import { Button } from '../../button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../../drawer';
import { addSort, flipSort, sortOnlyBy } from './cards';

const props = defineProps<{
	table: KitTable<TData>;
}>();

const open = defineModel<boolean>('open', { default: false });

const locale = useLocale();

type KitColumn = Column<KitFeatures, TData, unknown>;

const sortableColumns = computed(() => props.table.getAllLeafColumns().filter(column => column.getCanSort()));

const sorting = computed(() => props.table.atoms.sorting.get());

const draft = ref<DataTableSortingState>([]);

const adding = ref(false);

watch(open, (isOpen) => {
	if (!isOpen)
		return;

	draft.value = sorting.value;
	adding.value = false;
}, { immediate: true });

const draftChanged = computed(() => JSON.stringify(draft.value) !== JSON.stringify(sorting.value));

function sortsOf(state: DataTableSortingState) {
	return state.flatMap((sort, index) => {
		const column = sortableColumns.value.find(candidate => candidate.id === sort.id);

		return column === undefined ? [] : [{ column, desc: sort.desc, position: index + 1 }];
	});
}

const activeSorts = computed(() => sortsOf(sorting.value));

const draftSorts = computed(() => sortsOf(draft.value));

const addableColumns = computed(() => sortableColumns.value.filter(column => sortOf(column) === undefined && column.getCanMultiSort()));

const canAddSort = computed(() => draftSorts.value.length > 0 && addableColumns.value.length > 0);

const listedColumns = computed(() => (adding.value ? addableColumns.value : sortableColumns.value));

function columnLabel(column: KitColumn) {
	return column.columnDef.meta?.label ?? column.id;
}

type ColumnSort = ReturnType<typeof sortsOf>[number];

function directionLabel(desc: boolean) {
	return desc ? locale.value.dataTable.sortedDescendingLabel : locale.value.dataTable.sortedAscendingLabel;
}

function flipLabel(sort: ColumnSort, sorts: readonly ColumnSort[]) {
	return locale.value.dataTable.sortFlipLabel(columnLabel(sort.column), directionLabel(sort.desc), sorts.length > 1 ? sort.position : undefined);
}

function sortOf(column: KitColumn) {
	return draftSorts.value.find(sort => sort.column.id === column.id);
}

function pickColumn(column: KitColumn) {
	const field = { id: column.id, descFirst: column.getFirstSortDir() === 'desc' };

	draft.value = adding.value ? addSort(draft.value, field) : sortOnlyBy(draft.value, field);
	adding.value = false;
}

function flipDraft(column: KitColumn) {
	draft.value = flipSort(draft.value, column.id);
}

function removeFromDraft(column: KitColumn) {
	draft.value = draft.value.filter(sort => sort.id !== column.id);
}

function flipActiveSort(column: KitColumn) {
	props.table.setSorting(current => flipSort(current, column.id));
}

function removeSort(column: KitColumn) {
	props.table.setSorting(current => current.filter(sort => sort.id !== column.id));
}

function clearDraft() {
	draft.value = [];
	adding.value = false;
}

function applyDraft() {
	props.table.setSorting(draft.value);
	open.value = false;
}
</script>

<template>
	<div
		data-slot="data-table-sort"
		class="-mb-3 flex items-center gap-2 border-b bg-background py-2"
	>
		<Drawer v-model:open="open">
			<DrawerTrigger as-child>
				<Button
					variant="secondary"
					size="sm"
				>
					<ArrowUpDownIcon />
					{{ locale.dataTable.sortButtonText }}
					<Badge
						v-if="activeSorts.length > 0"
						class="tabular-nums"
					>
						{{ activeSorts.length }}
					</Badge>
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{{ locale.dataTable.sortButtonText }}</DrawerTitle>
					<DrawerDescription>{{ locale.dataTable.sortDescription }}</DrawerDescription>
				</DrawerHeader>
				<div class="flex min-h-0 flex-col gap-2 overflow-y-auto px-4">
					<ol
						v-if="draftSorts.length > 0"
						class="divide-y rounded-md border"
						:aria-label="locale.dataTable.sortOrderLabel"
					>
						<li
							v-for="sort in draftSorts"
							:key="sort.column.id"
							class="flex min-h-11 items-center gap-2 pr-1 pl-3 text-sm"
						>
							<span
								v-if="draftSorts.length > 1"
								class="w-4 shrink-0 text-xs text-muted-foreground tabular-nums"
							>{{ sort.position }}</span>
							<span class="min-w-0 flex-1 truncate font-medium">{{ columnLabel(sort.column) }}</span>
							<Button
								variant="ghost"
								size="sm"
								:aria-label="flipLabel(sort, draftSorts)"
								@click="flipDraft(sort.column)"
							>
								<ArrowDownIcon v-if="sort.desc" />
								<ArrowUpIcon v-else />
								{{ directionLabel(sort.desc) }}
							</Button>
							<Button
								variant="ghost"
								size="icon-xs"
								:aria-label="locale.dataTable.sortRemoveLabel(columnLabel(sort.column))"
								@click="removeFromDraft(sort.column)"
							>
								<XIcon />
							</Button>
						</li>
					</ol>

					<Button
						v-if="canAddSort"
						variant="ghost"
						size="sm"
						class="self-start aria-pressed:bg-muted"
						:aria-pressed="adding"
						@click="adding = !adding"
					>
						<PlusIcon />
						{{ locale.dataTable.sortAddButtonText }}
					</Button>

					<ul class="-mx-2 flex flex-col">
						<li
							v-for="column in listedColumns"
							:key="column.id"
						>
							<button
								type="button"
								class="flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 text-left text-sm outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:font-medium"
								:aria-pressed="sortOf(column) !== undefined"
								@click="pickColumn(column)"
							>
								{{ columnLabel(column) }}
								<template v-if="sortOf(column)">
									<ArrowDownIcon
										v-if="sortOf(column)?.desc"
										class="size-4 text-primary"
										:aria-label="locale.dataTable.sortedDescendingLabel"
									/>
									<ArrowUpIcon
										v-else
										class="size-4 text-primary"
										:aria-label="locale.dataTable.sortedAscendingLabel"
									/>
								</template>
							</button>
						</li>
					</ul>
				</div>
				<DrawerFooter class="flex-row">
					<Button
						variant="secondary"
						class="flex-1"
						:disabled="draftSorts.length === 0"
						@click="clearDraft"
					>
						{{ locale.dataTable.sortResetButtonText }}
					</Button>
					<Button
						class="flex-1"
						:disabled="!draftChanged"
						@click="applyDraft"
					>
						{{ locale.dataTable.sortApplyButtonText }}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>

		<div
			v-if="activeSorts.length > 0"
			class="-my-1 flex min-w-0 scrollbar-none gap-2 overflow-x-auto py-1"
		>
			<span
				v-for="sort in activeSorts"
				:key="sort.column.id"
				class="inline-flex h-7 shrink-0 items-center rounded-full border text-xs"
			>
				<button
					type="button"
					class="inline-flex h-full items-center gap-1 rounded-l-full pr-1 pl-2.5 outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
					:aria-label="flipLabel(sort, activeSorts)"
					@click="flipActiveSort(sort.column)"
				>
					<span
						v-if="activeSorts.length > 1"
						class="text-muted-foreground tabular-nums"
					>{{ sort.position }}</span>
					{{ columnLabel(sort.column) }}
					<ArrowDownIcon
						v-if="sort.desc"
						class="size-3.5"
					/>
					<ArrowUpIcon
						v-else
						class="size-3.5"
					/>
				</button>
				<button
					type="button"
					class="inline-flex h-full items-center rounded-r-full pr-2 pl-1 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
					:aria-label="locale.dataTable.sortRemoveLabel(columnLabel(sort.column))"
					@click="removeSort(sort.column)"
				>
					<XIcon class="size-3.5" />
				</button>
			</span>
		</div>
	</div>
</template>
