import type { DataTableColumn, DataTableSortingState } from './types';
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

  it('should reject a table that useDataTable did not create', () => {
    expect(() => unwrapDataTable({})).toThrow(TypeError);
  });
});
