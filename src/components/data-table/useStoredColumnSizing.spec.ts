import type { DataTableColumn } from './types';
import { nextTick, shallowRef } from 'vue';
import { selectColumn } from './columns/selectColumn';
import { useStoredColumnSizing } from './useStoredColumnSizing';

interface Lead {
	phone: string;
	site: string;
	geo: string;
}

const storageKey = 'leads-table-widths';

const geoColumn: DataTableColumn<Lead> = { accessorKey: 'geo' };

const columns: DataTableColumn<Lead>[] = [{ accessorKey: 'phone' }, { accessorKey: 'site' }];

describe('useStoredColumnSizing', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should start without widths when nothing is stored', () => {
		const columnSizing = useStoredColumnSizing(storageKey, columns);

		expect(columnSizing.value).toEqual({});
	});

	it('should take the stored widths', () => {
		localStorage.setItem(storageKey, JSON.stringify({ phone: 120, site: 200 }));

		const columnSizing = useStoredColumnSizing(storageKey, columns);

		expect(columnSizing.value).toEqual({ phone: 120, site: 200 });
	});

	it('should store a changed width', async () => {
		const columnSizing = useStoredColumnSizing(storageKey, columns);

		columnSizing.value = { phone: 140 };
		await nextTick();

		expect(localStorage.getItem(storageKey)).toBe(JSON.stringify({ phone: 140 }));
	});

	it('should keep the widths of the select column and the columns inside a group', () => {
		localStorage.setItem(storageKey, JSON.stringify({ select: 32, phone: 120, site: 200 }));

		const columnSizing = useStoredColumnSizing<Lead>(storageKey, [
			selectColumn(),
			{ id: 'contact', header: 'Contact', columns: [{ accessorKey: 'phone' }, { accessorKey: 'site' }] },
		]);

		expect(columnSizing.value).toEqual({ select: 32, phone: 120, site: 200 });
	});

	it('should leave a column that appears later without a width and keep the stored ones', async () => {
		localStorage.setItem(storageKey, JSON.stringify({ site: 200 }));

		const shownColumns = shallowRef<DataTableColumn<Lead>[]>(columns);
		const columnSizing = useStoredColumnSizing(storageKey, shownColumns);

		shownColumns.value = [...columns, geoColumn];
		await nextTick();

		expect(columnSizing.value).toEqual({ site: 200 });
	});

	it('should forget the width of a column that the table no longer has', async () => {
		localStorage.setItem(storageKey, JSON.stringify({ phone: 120, geo: 90 }));

		const shownColumns = shallowRef<DataTableColumn<Lead>[]>([...columns, geoColumn]);
		const columnSizing = useStoredColumnSizing(storageKey, shownColumns);

		shownColumns.value = columns;
		await nextTick();

		expect(columnSizing.value).toEqual({ phone: 120 });
	});

	it('should drop a stored width that is not a number', () => {
		localStorage.setItem(storageKey, JSON.stringify({ phone: 'wide', site: 200 }));

		const columnSizing = useStoredColumnSizing(storageKey, columns);

		expect(columnSizing.value).toEqual({ site: 200 });
	});

	it('should start without widths when the stored value is broken', () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		localStorage.setItem(storageKey, 'not json');

		const columnSizing = useStoredColumnSizing(storageKey, columns);

		expect(columnSizing.value).toEqual({});
	});
});
