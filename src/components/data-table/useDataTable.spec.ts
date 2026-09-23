import type { DataTableColumn, DataTablePaginationState, DataTableSortingState } from './types';
import { nextTick, ref } from 'vue';
import { unwrapDataTable } from './lib/instance';
import { useDataTable } from './useDataTable';

interface Person {
  id: string;
  name: string;
}

const columns: DataTableColumn<Person>[] = [{ accessorKey: 'name' }];

function rowValues(table: ReturnType<typeof useDataTable<Person>>, columnId: string) {
  return unwrapDataTable(table).getRowModel().rows.map(row => row.getValue(columnId));
}

describe('useDataTable', () => {
  it('should follow the data ref', async () => {
    const people = ref<Person[]>([{ id: 'ada', name: 'Ada' }]);
    const table = useDataTable({ data: people, columns });

    people.value = [...people.value, { id: 'linus', name: 'Linus' }];
    await nextTick();

    expect(rowValues(table, 'name')).toEqual(['Ada', 'Linus']);
  });

  it('should follow the columns getter', async () => {
    const withId = ref(false);
    const table = useDataTable<Person>({
      data: [{ id: 'ada', name: 'Ada' }],
      columns: () => (withId.value ? [...columns, { accessorKey: 'id' }] : columns),
    });

    withId.value = true;
    await nextTick();

    expect(unwrapDataTable(table).getAllLeafColumns().map(column => column.id)).toEqual(['name', 'id']);
  });

  it('should identify rows by getRowId', () => {
    const table = useDataTable({
      data: [{ id: 'ada', name: 'Ada' }],
      columns,
      getRowId: person => person.id,
    });

    expect(unwrapDataTable(table).getRowModel().rows.map(row => row.id)).toEqual(['ada']);
  });

  describe('sorting', () => {
    const people: Person[] = [{ id: 'ada', name: 'Ada' }, { id: 'linus', name: 'Linus' }];
    const sortableColumns: DataTableColumn<Person>[] = [{ accessorKey: 'name', sortable: true }];

    it('should write a sorting change made through the table to the passed ref', () => {
      const sorting = ref<DataTableSortingState>([]);
      const table = useDataTable({ data: people, columns: sortableColumns, sorting });

      unwrapDataTable(table).getColumn('name')?.toggleSorting();

      expect(sorting.value).toEqual([{ id: 'name', desc: false }]);
    });

    it('should sort the rows by the passed ref', async () => {
      const sorting = ref<DataTableSortingState>([]);
      const table = useDataTable({ data: people, columns: sortableColumns, sorting });

      sorting.value = [{ id: 'name', desc: true }];
      await nextTick();

      expect(rowValues(table, 'name')).toEqual(['Linus', 'Ada']);
    });

    it('should keep the order of the rows that come from the server', () => {
      const table = useDataTable({
        data: people,
        columns: sortableColumns,
        serverSide: true,
        sorting: ref([{ id: 'name', desc: true }]),
      });

      expect(rowValues(table, 'name')).toEqual(['Ada', 'Linus']);
    });
  });

  describe('pagination', () => {
    const people: Person[] = ['Ada', 'Alan', 'Grace', 'Linus', 'Margaret'].map(name => ({ id: name.toLowerCase(), name }));

    it('should show every row without a pagination ref', () => {
      const table = useDataTable({ data: people, columns });

      expect(rowValues(table, 'name')).toEqual(['Ada', 'Alan', 'Grace', 'Linus', 'Margaret']);
    });

    it('should show the page of the passed ref and write a page change to it', async () => {
      const pagination = ref<DataTablePaginationState>({ pageIndex: 1, pageSize: 2 });
      const table = useDataTable({ data: people, columns, pagination });

      expect(rowValues(table, 'name')).toEqual(['Grace', 'Linus']);

      unwrapDataTable(table).nextPage();
      await nextTick();

      expect(pagination.value).toEqual({ pageIndex: 2, pageSize: 2 });
      expect(rowValues(table, 'name')).toEqual(['Margaret']);
    });

    it('should keep the rows that come from the server and count the pages from the total', () => {
      const table = useDataTable({
        data: people.slice(0, 2),
        columns,
        serverSide: true,
        totalRowCount: () => 5,
        pagination: ref({ pageIndex: 1, pageSize: 2 }),
      });

      expect(rowValues(table, 'name')).toEqual(['Ada', 'Alan']);
      expect(unwrapDataTable(table).getPageCount()).toBe(3);
    });

    it('should go to the first page when the sorting changes', () => {
      const pagination = ref<DataTablePaginationState>({ pageIndex: 2, pageSize: 2 });
      const table = useDataTable({
        data: people,
        columns: [{ accessorKey: 'name', sortable: true }],
        serverSide: true,
        pagination,
      });

      unwrapDataTable(table).getColumn('name')?.toggleSorting();

      expect(pagination.value).toEqual({ pageIndex: 0, pageSize: 2 });
    });
  });

  it('should reject a table that useDataTable did not create', () => {
    expect(() => unwrapDataTable({})).toThrow(TypeError);
  });
});
