import type { DataTableColumn, DataTableSortingState } from './types';
import type { UseDataTableOptions } from './useDataTable';
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
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
  tableOptions?: Omit<UseDataTableOptions<Person>, 'data' | 'columns'>;
  bindings?: Record<string, unknown>;
}

function mountTable(template = '<DataTable :table="table" />', options: MountOptions = {}) {
  const Host = defineComponent({
    components: { DataTable },
    setup() {
      const table = useDataTable({
        data: options.data ?? people,
        columns: options.columns ?? columns,
        ...options.tableOptions,
      });

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

  describe('sorting', () => {
    const crew: Person[] = [
      { id: 'linus', name: 'Linus', age: 54 },
      { id: 'ada', name: 'Ada', age: 54 },
      { id: 'grace', name: 'Grace', age: 36 },
    ];

    const sortableColumns: DataTableColumn<Person>[] = [
      { accessorKey: 'id', header: 'Code' },
      { accessorKey: 'name', header: 'Name', sortable: true },
      { accessorKey: 'age', header: 'Age', sortable: true },
    ];

    function mountSortable(template?: string, tableOptions?: MountOptions['tableOptions']) {
      return mountTable(template, { data: crew, columns: sortableColumns, tableOptions });
    }

    function rowIds(wrapper: ReturnType<typeof mountTable>) {
      return bodyRows(wrapper).map(([id]) => id);
    }

    it('should not sort by a column without the sortable flag', async () => {
      const wrapper = mountSortable();
      const idHeader = wrapper.getElementByText('th', 'Code');

      await idHeader.trigger('click');

      expect(rowIds(wrapper)).toEqual(['linus', 'ada', 'grace']);
      expect(idHeader.attributes()).not.toHaveProperty('aria-sort');
      expect(idHeader.attributes()).not.toHaveProperty('tabindex');
    });

    it('should cycle a column from ascending to descending to unsorted', async () => {
      const wrapper = mountSortable();
      const ageHeader = wrapper.getElementByText('th', 'Age');

      expect(ageHeader.attributes('aria-sort')).toBe('none');

      await ageHeader.trigger('click');

      expect(ageHeader.attributes('aria-sort')).toBe('ascending');
      expect(rowIds(wrapper)).toEqual(['grace', 'linus', 'ada']);

      await ageHeader.trigger('click');

      expect(ageHeader.attributes('aria-sort')).toBe('descending');
      expect(rowIds(wrapper)).toEqual(['linus', 'ada', 'grace']);

      await ageHeader.trigger('click');

      expect(ageHeader.attributes('aria-sort')).toBe('none');
      expect(rowIds(wrapper)).toEqual(['linus', 'ada', 'grace']);
    });

    it('should sort from the keyboard', async () => {
      const wrapper = mountSortable();
      const ageHeader = wrapper.getElementByText('th', 'Age');

      await ageHeader.trigger('keydown', { key: 'Enter' });

      expect(ageHeader.attributes('aria-sort')).toBe('ascending');

      await ageHeader.trigger('keydown', { key: ' ' });

      expect(ageHeader.attributes('aria-sort')).toBe('descending');
    });

    it('should add a column to the sorting on shift click and number the sorted columns', async () => {
      const sorting = ref<DataTableSortingState>([]);
      const wrapper = mountSortable(undefined, { sorting, enableMultiSort: true });

      await wrapper.getElementByText('th', 'Age').trigger('click');
      await wrapper.getElementByText('th', 'Name').trigger('click', { shiftKey: true });

      expect(sorting.value).toEqual([{ id: 'age', desc: false }, { id: 'name', desc: false }]);
      expect(rowIds(wrapper)).toEqual(['grace', 'ada', 'linus']);
      expect(wrapper.findAll('th').map(header => header.text())).toEqual(['Code', 'Name 2', 'Age 1']);
    });

    it('should replace the sorting on shift click without multi-sort', async () => {
      const sorting = ref<DataTableSortingState>([]);
      const wrapper = mountSortable(undefined, { sorting });

      await wrapper.getElementByText('th', 'Age').trigger('click');
      await wrapper.getElementByText('th', 'Name').trigger('click', { shiftKey: true });

      expect(sorting.value).toEqual([{ id: 'name', desc: false }]);
    });

    it('should ignore a click and a key press on a link inside the header', async () => {
      const wrapper = mountSortable(
        `<DataTable :table="table">
          <template #header-age="{ label }"><a href="#age">{{ label }}</a></template>
        </DataTable>`,
      );

      await wrapper.get('th a').trigger('click');
      await wrapper.get('th a').trigger('keydown', { key: 'Enter' });

      expect(wrapper.getElementByText('th', 'Age').attributes('aria-sort')).toBe('none');
    });
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

  describe('load more', () => {
    const clientHeight = 400;
    let scrollTop = 0;
    let scrollHeight = 1000;

    class VisibleIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '0px';
      readonly scrollMargin = '0px';
      readonly thresholds = [0];

      constructor(private readonly callback: IntersectionObserverCallback) {}

      observe(target: Element) {
        const rect = target.getBoundingClientRect();
        this.callback([{ target, time: 0, isIntersecting: true, intersectionRatio: 1, boundingClientRect: rect, intersectionRect: rect, rootBounds: null }], this);
      }

      unobserve() {}

      disconnect() {}

      takeRecords() {
        return [];
      }
    }

    beforeEach(() => {
      scrollTop = 0;
      scrollHeight = 1000;
      vi.stubGlobal('IntersectionObserver', VisibleIntersectionObserver);
      vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(() => clientHeight);
      vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(() => scrollHeight);
      vi.spyOn(Element.prototype, 'scrollTop', 'get').mockImplementation(() => scrollTop);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    function mountScrollableTable(attributes: string, bindings: Record<string, unknown> = {}) {
      const loadMore = vi.fn();
      const wrapper = mountTable(`<DataTable :table="table" ${attributes} @load-more="loadMore" />`, { bindings: { loadMore, ...bindings } });

      return { wrapper, loadMore };
    }

    async function scrollToBottom(wrapper: ReturnType<typeof mountTable>, gap = 0) {
      scrollTop = scrollHeight - clientHeight - gap;
      await wrapper.get('[data-slot="table-container"]').trigger('scroll');
      await flushPromises();
    }

    it('should ask for the next page when scrolled close to the bottom', async () => {
      const { wrapper, loadMore } = mountScrollableTable('has-next-page');
      await flushPromises();

      expect(loadMore).not.toHaveBeenCalled();

      await scrollToBottom(wrapper, 50);

      expect(loadMore).toHaveBeenCalledTimes(1);
    });

    it('should ask for the next page right away when the rows do not fill the table', async () => {
      scrollHeight = clientHeight;
      const { loadMore } = mountScrollableTable('has-next-page');
      await flushPromises();

      expect(loadMore).toHaveBeenCalledTimes(1);
    });

    it('should not ask for a page without a next page', async () => {
      const { wrapper, loadMore } = mountScrollableTable('');

      await scrollToBottom(wrapper);

      expect(loadMore).not.toHaveBeenCalled();
    });

    it('should not ask for a page while the table is loading', async () => {
      const { wrapper, loadMore } = mountScrollableTable('has-next-page loading');

      await scrollToBottom(wrapper);

      expect(loadMore).not.toHaveBeenCalled();
    });

    it('should wait for the page being loaded before asking for the next one', async () => {
      const loadingMore = ref(true);
      const { wrapper, loadMore } = mountScrollableTable('has-next-page :loading-more="loadingMore"', { loadingMore });

      await scrollToBottom(wrapper);

      expect(loadMore).not.toHaveBeenCalled();

      loadingMore.value = false;
      await flushPromises();

      expect(loadMore).toHaveBeenCalledTimes(1);
    });

    it('should show a spinner row under the rows while the next page loads', () => {
      const wrapper = mountTable('<DataTable :table="table" loading-more />');
      const lastCell = wrapper.get('tbody tr:last-child td');

      expect(lastCell.find('[role="status"]').exists()).toBe(true);
      expect(lastCell.attributes('colspan')).toBe('2');
      expect(wrapper.findAll('tbody tr')).toHaveLength(3);
      expect(wrapper.get('tbody').classes()).not.toContain('opacity-50');
      expect(wrapper.get('[aria-busy]').attributes('aria-busy')).toBe('true');
    });
  });

  describe('row click', () => {
    it('should pass the row data to the listener', async () => {
      const openPerson = vi.fn();
      const wrapper = mountTable('<DataTable :table="table" @row-click="openPerson" />', { bindings: { openPerson } });

      await wrapper.getElementByText('td', 'Linus').trigger('click');

      expect(openPerson).toHaveBeenCalledWith(people[1]);
      expect(wrapper.get('tbody tr').classes()).toEqual(expect.arrayContaining(['cursor-pointer', 'hover:bg-muted/50']));
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

    it('should not look clickable and leave every row background alone on hover without a listener', () => {
      const wrapper = mountTable();

      expect(wrapper.get('tbody tr').classes()).not.toContain('cursor-pointer');
      expect(wrapper.findAll('tr').filter(row => row.classes().some(className => className.startsWith('hover:')))).toEqual([]);
    });
  });
});
