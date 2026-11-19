<script setup lang="ts">
import type { DataTableColumn, DataTableColumnSizingState } from 'shonk-ui';
import { Button, DataTable, selectColumn, Switch, useDataTable } from 'shonk-ui';
import { h, ref } from 'vue';

interface Lead {
	id: string;
	phone: string;
	site: string;
	comment: string;
	geo: string;
	manager: string;
	calls: number;
	deals: number;
	active: boolean;
}

const sites = ['acme.com', 'globex-international-holdings.com', 'initech.com', 'hooli.xyz', 'umbrella-corporation.co.uk'];
const comments = [
	'Asked to call back after the holidays',
	'Interested in the annual plan, wants a discount for the second office',
	'No answer',
	'Sent the offer by email',
];
const geos = ['Springfield', 'Riverside', 'Fairview', 'Hillcrest'];
const managers = ['Ada Lovelace', 'Grace Hopper', 'Linus Torvalds'];

const leads = ref<Lead[]>(Array.from({ length: 30 }, (_, index) => ({
	id: String(index + 1),
	phone: `+1 555 ${String(index).padStart(4, '0')}`,
	site: sites[index % sites.length] ?? '',
	comment: comments[index % comments.length] ?? '',
	geo: geos[index % geos.length] ?? '',
	manager: managers[index % managers.length] ?? '',
	calls: (index * 7) % 23,
	deals: (index * 3) % 5,
	active: index % 3 !== 2,
})));

function setActive(lead: Lead, active: boolean) {
	leads.value = leads.value.map(row => row.id === lead.id ? { ...row, active } : row);
}

const numeric = { class: 'text-right tabular-nums', headerClass: 'text-right' };

const columns: DataTableColumn<Lead>[] = [
	selectColumn(),
	{ accessorKey: 'phone', header: 'Phone', pinned: true, sortable: true },
	{ accessorKey: 'site', header: 'Site', size: 160, sortable: true },
	{ accessorKey: 'comment', header: 'Comment', size: 240 },
	{
		id: 'contact',
		header: 'Contact',
		columns: [
			{ accessorKey: 'geo', header: 'Geo' },
			{ accessorKey: 'manager', header: 'Manager', sortable: true },
		],
	},
	{ accessorKey: 'calls', header: 'Calls', sortable: true, ...numeric },
	{ accessorKey: 'deals', header: 'Deals', sortable: true, ...numeric },
	{
		accessorKey: 'active',
		header: 'Active',
		resizable: false,
		cell: ({ row, value }) => h(Switch, { 'modelValue': value, 'onUpdate:modelValue': (active: boolean) => setActive(row, active) }),
	},
];

const columnSizing = ref<DataTableColumnSizingState>({});

const table = useDataTable({ data: leads, columns, getRowId: lead => lead.id, columnSizing });

function resetWidths() {
	columnSizing.value = {};
}
</script>

<template>
	<div class="flex max-w-3xl flex-col gap-4">
		<div class="flex min-h-8 items-center justify-between gap-4">
			<p class="text-sm text-muted-foreground">
				Drag the right edge of a header to resize its column, double-click it to fit the column to its content again. Site and Comment start at their size, the switch column keeps its width.
			</p>
			<Button
				variant="secondary"
				size="sm"
				@click="resetWidths"
			>
				Reset widths
			</Button>
		</div>

		<DataTable
			:table="table"
			class="max-h-120"
		/>
	</div>
</template>
