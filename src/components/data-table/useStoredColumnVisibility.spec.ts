import type { DataTableColumn } from './types';
import { nextTick, shallowRef } from 'vue';
import { selectColumn } from './columns/selectColumn';
import { useStoredColumnVisibility } from './useStoredColumnVisibility';

interface Lead {
  phone: string;
  site: string;
  geo: string;
}

const storageKey = 'leads-table-columns';

const geoColumn: DataTableColumn<Lead> = { accessorKey: 'geo' };

const columns: DataTableColumn<Lead>[] = [{ accessorKey: 'phone' }, { accessorKey: 'site' }];

describe('useStoredColumnVisibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show every column when nothing is stored', () => {
    const columnVisibility = useStoredColumnVisibility(storageKey, columns);

    expect(columnVisibility.value).toEqual({ phone: true, site: true });
  });

  it('should take the visibility of a stored column', () => {
    localStorage.setItem(storageKey, JSON.stringify({ site: false }));

    const columnVisibility = useStoredColumnVisibility(storageKey, columns);

    expect(columnVisibility.value).toEqual({ phone: true, site: false });
  });

  it('should store a hidden column', async () => {
    const columnVisibility = useStoredColumnVisibility(storageKey, columns);

    columnVisibility.value = { ...columnVisibility.value, site: false };
    await nextTick();

    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify({ phone: true, site: false }));
  });

  it('should leave out the columns that cannot be hidden', () => {
    const columnVisibility = useStoredColumnVisibility<Lead>(storageKey, [
      selectColumn(),
      { accessorKey: 'phone', hideable: false },
      { accessorKey: 'site' },
    ]);

    expect(columnVisibility.value).toEqual({ site: true });
  });

  it('should reach the columns inside a group', () => {
    const columnVisibility = useStoredColumnVisibility<Lead>(storageKey, [
      { id: 'contact', header: 'Contact', columns: [{ accessorKey: 'phone' }, { accessorKey: 'site' }] },
    ]);

    expect(columnVisibility.value).toEqual({ phone: true, site: true });
  });

  it('should show a column that appears later and keep the stored ones', async () => {
    localStorage.setItem(storageKey, JSON.stringify({ site: false }));

    const shownColumns = shallowRef<DataTableColumn<Lead>[]>(columns);
    const columnVisibility = useStoredColumnVisibility(storageKey, shownColumns);

    shownColumns.value = [...columns, geoColumn];
    await nextTick();

    expect(columnVisibility.value).toEqual({ phone: true, site: false, geo: true });
  });

  it('should forget a column that the table no longer has', async () => {
    const shownColumns = shallowRef<DataTableColumn<Lead>[]>([...columns, geoColumn]);
    const columnVisibility = useStoredColumnVisibility(storageKey, shownColumns);

    shownColumns.value = columns;
    await nextTick();

    expect(columnVisibility.value).toEqual({ phone: true, site: true });
  });

  it('should show every column when the stored value is broken', () => {
    localStorage.setItem(storageKey, 'not json');

    const columnVisibility = useStoredColumnVisibility(storageKey, columns);

    expect(columnVisibility.value).toEqual({ phone: true, site: true });
  });
});
