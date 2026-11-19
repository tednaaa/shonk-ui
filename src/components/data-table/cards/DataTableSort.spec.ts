import type { DataTableColumn, DataTableSortingState } from '../types';
import { DOMWrapper, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { computed, defineComponent, ref } from 'vue';
import { unwrapDataTable } from '../core/instance';
import { useDataTable } from '../core/useDataTable';
import DataTableSort from './DataTableSort.vue';

interface Pair {
	token: string;
	price: number;
	volume: number;
}

const columns: DataTableColumn<Pair>[] = [
	{ accessorKey: 'token', header: 'Token' },
	{ accessorKey: 'price', header: 'Price', sortable: true },
	{ accessorKey: 'volume', header: 'Volume', sortable: true, sortDescFirst: true },
];

enableAutoUnmount(afterEach);

const body = new DOMWrapper(document.body);

async function mountSort(initial: DataTableSortingState = []) {
	const sorting = ref(initial);

	const Host = defineComponent({
		components: { DataTableSort },
		setup() {
			const table = useDataTable({ data: [], columns, sorting, enableMultiSort: true });

			return { table: computed(() => unwrapDataTable(table)) };
		},
		template: '<DataTableSort :table="table" />',
	});

	mount(Host, { attachTo: document.body });
	await openDrawer();

	return { sorting };
}

async function openDrawer() {
	await body.get('[data-slot="data-table-sort"] button').trigger('click');
	await flushPromises();
}

async function press(text: string) {
	await body.getElementByText('[role="dialog"] button', text).trigger('click');
	await flushPromises();
}

describe('dataTableSort', () => {
	it('should replace the sorting on a tap and keep it unapplied until Apply', async () => {
		const { sorting } = await mountSort([{ id: 'price', desc: false }]);

		await press('Volume');

		expect(sorting.value).toEqual([{ id: 'price', desc: false }]);

		await press('Apply');

		expect(sorting.value).toEqual([{ id: 'volume', desc: true }]);
	});

	it('should add a lower level through Add another sort', async () => {
		const { sorting } = await mountSort();

		await press('Price');
		await press('Add another sort');
		await press('Volume');

		expect(sorting.value).toEqual([]);

		await press('Apply');

		expect(sorting.value).toEqual([{ id: 'price', desc: false }, { id: 'volume', desc: true }]);
	});

	it('should flip the direction from a chip and keep the sort', async () => {
		const { sorting } = await mountSort([{ id: 'price', desc: false }]);

		await body.get('[data-slot="data-table-sort"] [aria-label="Price, ascending. Flip the order"]').trigger('click');

		expect(sorting.value).toEqual([{ id: 'price', desc: true }]);
	});

	it('should name the chips and the drawer rows after the field, its direction and its level', async () => {
		await mountSort([{ id: 'price', desc: false }, { id: 'volume', desc: true }]);

		const names = [
			'Level 1: Price, ascending. Flip the order',
			'Remove sorting by Price',
			'Level 2: Volume, descending. Flip the order',
			'Remove sorting by Volume',
		];

		expect(body.findAll('[data-slot="data-table-sort"] button[aria-label]').map(button => button.attributes('aria-label'))).toEqual(names);
		expect(body.findAll('[role="dialog"] ol button[aria-label]').map(button => button.attributes('aria-label'))).toEqual(names);
	});

	it('should drop the unapplied picks when the drawer is closed and reopened', async () => {
		const { sorting } = await mountSort([{ id: 'price', desc: false }]);

		await press('Reset');
		await body.get('[role="dialog"]').trigger('keydown', { key: 'Escape' });
		await flushPromises();
		await openDrawer();

		expect(sorting.value).toEqual([{ id: 'price', desc: false }]);
		expect(body.getElementByText('[role="dialog"] button', 'Price').attributes('aria-pressed')).toBe('true');
	});
});
