import type { DataTableColumn } from './types';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import DataTable from './DataTable.vue';
import { useDataTable } from './useDataTable';

interface Person {
  id: string;
  name: string;
  age: number;
}

const people: Person[] = [
  { id: 'ada', name: 'Ada', age: 36 },
  { id: 'linus', name: 'Linus', age: 54 },
];

const columns: DataTableColumn<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];

interface MountOptions {
  data?: Person[];
  columns?: DataTableColumn<Person>[];
  bindings?: Record<string, unknown>;
}

function mountTable(template = '<DataTable :table="table" />', options: MountOptions = {}) {
  const Host = defineComponent({
    components: { DataTable },
    setup() {
      const table = useDataTable({ data: options.data ?? people, columns: options.columns ?? columns });

      return { table, ...options.bindings };
    },
    template,
  });

  return mount(Host);
}

function bodyRows(wrapper: ReturnType<typeof mountTable>) {
  return wrapper.findAll('tbody tr').map(row => row.findAll('td').map(cell => cell.text()));
}

describe('dataTable', () => {
  it('should render the headers and the values of every row', () => {
    const wrapper = mountTable();

    expect(wrapper.findAll('th').map(header => header.text())).toEqual(['Name', 'Age']);
    expect(bodyRows(wrapper)).toEqual([['Ada', '36'], ['Linus', '54']]);
  });

  it('should render a cell through the column render function and through a slot', () => {
    const wrapper = mountTable(
      `<DataTable :table="table">
        <template #cell-age="{ row, value }"><i>{{ row.name }}: {{ value }}</i></template>
      </DataTable>`,
      {
        columns: [
          { accessorKey: 'name', cell: ({ row, value }) => h('b', `${value} (${row.age})`) },
          { accessorKey: 'age' },
        ],
      },
    );

    expect(bodyRows(wrapper)).toEqual([['Ada (36)', 'Ada: 36'], ['Linus (54)', 'Linus: 54']]);
  });

  it('should pass the header label to the header slot', () => {
    const wrapper = mountTable(
      `<DataTable :table="table">
        <template #header-age="{ label }"><a href="#age">{{ label }}</a></template>
      </DataTable>`,
    );

    expect(wrapper.get('th a[href="#age"]').text()).toBe('Age');
  });

  it('should span a group header over its columns', () => {
    const wrapper = mountTable(undefined, {
      columns: [{ id: 'person', header: 'Person', columns }],
    });

    expect(wrapper.getElementByText('th', 'Person').attributes('colspan')).toBe('2');
  });

  it('should apply the column classes and the row class', () => {
    const wrapper = mountTable('<DataTable :table="table" :row-class="rowClass" />', {
      columns: [{ accessorKey: 'age', class: 'text-right', headerClass: 'w-20' }],
      bindings: { rowClass: (person: Person) => person.age > 50 && 'font-semibold' },
    });

    expect(wrapper.get('th').classes()).toContain('w-20');
    expect(wrapper.findAll('td').map(cell => cell.classes('text-right'))).toEqual([true, true]);
    expect(wrapper.findAll('tbody tr').map(row => row.classes('font-semibold'))).toEqual([false, true]);
  });

  describe('without rows', () => {
    it('should span the empty text over every leaf column', () => {
      const wrapper = mountTable(undefined, {
        data: [],
        columns: [{ accessorKey: 'id' }, { id: 'person', columns }],
      });

      const emptyCell = wrapper.get('tbody td');

      expect(emptyCell.text()).toBe('No data');
      expect(emptyCell.attributes('colspan')).toBe('3');
    });

    it('should show the empty text passed in props', () => {
      const wrapper = mountTable('<DataTable :table="table" empty-text="Nothing found" />', { data: [] });

      expect(wrapper.get('tbody td').text()).toBe('Nothing found');
    });

    it('should prefer the empty slot over the empty text', () => {
      const wrapper = mountTable(
        `<DataTable :table="table" empty-text="Nothing found">
          <template #empty>Create the first record</template>
        </DataTable>`,
        { data: [] },
      );

      expect(wrapper.get('tbody td').text()).toBe('Create the first record');
    });

    it('should show a spinner instead of the empty text while loading', () => {
      const wrapper = mountTable('<DataTable :table="table" loading />', { data: [] });

      expect(wrapper.find('tbody [role="status"]').exists()).toBe(true);
      expect(wrapper.text()).not.toContain('No data');
    });
  });

  it('should dim the rows and mark the table busy while loading', () => {
    const wrapper = mountTable('<DataTable :table="table" loading />');

    expect(wrapper.get('tbody').classes()).toEqual(expect.arrayContaining(['pointer-events-none', 'opacity-50']));
    expect(wrapper.get('[aria-busy]').attributes('aria-busy')).toBe('true');
    expect(bodyRows(wrapper)).toHaveLength(2);
  });

  describe('row click', () => {
    it('should pass the row data to the listener', async () => {
      const openPerson = vi.fn();
      const wrapper = mountTable('<DataTable :table="table" @row-click="openPerson" />', { bindings: { openPerson } });

      await wrapper.getElementByText('td', 'Linus').trigger('click');

      expect(openPerson).toHaveBeenCalledWith(people[1]);
      expect(wrapper.get('tbody tr').classes()).toContain('cursor-pointer');
    });

    it('should ignore a click on a control inside a cell', async () => {
      const openPerson = vi.fn();
      const wrapper = mountTable(
        `<DataTable :table="table" @row-click="openPerson">
          <template #cell-name="{ value }"><button type="button"><span>{{ value }}</span></button></template>
        </DataTable>`,
        { bindings: { openPerson } },
      );

      await wrapper.getElementByText('span', 'Ada').trigger('click');

      expect(openPerson).not.toHaveBeenCalled();
    });

    it('should not look clickable without a listener', () => {
      const wrapper = mountTable();

      expect(wrapper.get('tbody tr').classes()).not.toContain('cursor-pointer');
    });
  });
});
