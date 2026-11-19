import type { UseDataTableOptions } from '../core/useDataTable';
import type { DataTableColumn } from '../types';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { computed, defineComponent, h, nextTick, ref, shallowRef } from 'vue';
import { useStoredColumnVisibility } from '../column-visibility/useStoredColumnVisibility';
import { unwrapCards, unwrapDataTable } from '../core/instance';
import { useDataTable } from '../core/useDataTable';
import { selectColumn } from '../row-selection/selectColumn';
import DataTableCards from './DataTableCards.vue';

interface Pair {
	token: string;
	price: number;
	volume: number;
	atr: number;
	mfi: number;
	adx: number;
	rsi: number;
}

const columns: DataTableColumn<Pair>[] = [
	{ accessorKey: 'token', header: 'Token' },
	{ accessorKey: 'price', header: 'Price' },
	{ accessorKey: 'volume', header: 'Volume' },
	{ accessorKey: 'atr', header: 'ATR' },
	{ accessorKey: 'mfi', header: 'MFI' },
	{ accessorKey: 'adx', header: 'ADX' },
	{ accessorKey: 'rsi', header: 'RSI' },
];

const btc: Pair = { token: 'BTC', price: 1, volume: 2, atr: 3, mfi: 4, adx: 5, rsi: 6 };

enableAutoUnmount(afterEach);

interface MountOptions extends Partial<UseDataTableOptions<Pair>> {
	fieldLimit?: number;
}

function mountCards({ fieldLimit, ...options }: MountOptions = {}) {
	const Host = defineComponent({
		components: { DataTableCards },
		setup() {
			const table = useDataTable({ data: [btc], columns, ...options });
			const cards = unwrapCards(table);

			if (fieldLimit !== undefined)
				cards.fieldLimit.value = fieldLimit;

			return { table: computed(() => unwrapDataTable(table)), cards };
		},
		template: '<DataTableCards :table="table" :cards="cards" />',
	});

	return mount(Host);
}

describe('dataTableCards', () => {
	it('should show the first four fields and reveal the rest on Show more', async () => {
		const wrapper = mountCards();

		expect(wrapper.findAll('dt').map(term => term.text())).toEqual(['Price', 'Volume', 'ATR', 'MFI']);

		const toggle = wrapper.get('button[aria-expanded]');

		expect(toggle.text()).toBe('Show 2 more');

		await toggle.trigger('click');

		expect(wrapper.findAll('dt').map(term => term.text())).toEqual(['Price', 'Volume', 'ATR', 'MFI', 'ADX', 'RSI']);
		expect(toggle.attributes('aria-expanded')).toBe('true');
	});

	it('should keep every field behind Show more with a limit of zero', async () => {
		const wrapper = mountCards({ fieldLimit: 0 });

		expect(wrapper.findAll('dt')).toHaveLength(0);

		await wrapper.get('button[aria-expanded]').trigger('click');

		expect(wrapper.findAll('dt').map(term => term.text())).toEqual(['Price', 'Volume', 'ATR', 'MFI', 'ADX', 'RSI']);
	});

	it('should leave a column hidden in the table out of the card header', () => {
		const menuColumn: DataTableColumn<Pair> = { id: 'menu', cell: () => h('button', { 'aria-label': 'Open menu' }) };
		const wrapper = mountCards({ columns: [...columns, menuColumn], columnVisibility: ref({ menu: false }) });

		expect(wrapper.find('button[aria-label="Open menu"]').exists()).toBe(false);
	});

	it('should name each card checkbox after its card title', () => {
		const wrapper = mountCards({ data: [btc, { ...btc, token: 'ETH' }], columns: [selectColumn(), ...columns] });

		const names = wrapper.findAll('[role="checkbox"]').map(checkbox => wrapper.get(`[id="${checkbox.attributes('aria-labelledby')}"]`).text());

		expect(names).toEqual(['BTC', 'ETH']);
	});

	describe('with picked card fields in storage', () => {
		const storageKey = 'pairs-table-columns';

		function mountStoredCards() {
			const shownColumns = shallowRef(columns.slice(0, 3));
			const wrapper = mountCards({ columns: shownColumns, columnVisibility: useStoredColumnVisibility(storageKey, shownColumns) });

			return { wrapper, shownColumns };
		}

		beforeEach(() => {
			localStorage.clear();
			localStorage.setItem(`${storageKey}:cards`, JSON.stringify({ price: true, volume: false }));
		});

		it('should show a column that appears later and keep the picks', async () => {
			const { wrapper, shownColumns } = mountStoredCards();

			shownColumns.value = columns.slice(0, 4);
			await nextTick();

			expect(wrapper.findAll('dt').map(term => term.text())).toEqual(['Price', 'ATR']);
		});

		it('should forget the pick of a column that the table no longer has', async () => {
			const { wrapper, shownColumns } = mountStoredCards();

			shownColumns.value = columns.slice(0, 2);
			await nextTick();
			shownColumns.value = columns.slice(0, 3);
			await nextTick();

			expect(wrapper.findAll('dt').map(term => term.text())).toEqual(['Price', 'Volume']);
		});
	});
});
