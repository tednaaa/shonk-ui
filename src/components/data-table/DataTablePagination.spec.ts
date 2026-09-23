import type { DataTableColumn, DataTablePaginationState } from './types';
import type { UseDataTableOptions } from './useDataTable';
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import DataTable from './DataTable.vue';
import DataTablePagination from './DataTablePagination.vue';
import DataTablePaginationPages from './DataTablePaginationPages.vue';
import DataTablePaginationPageSizeSelect from './DataTablePaginationPageSizeSelect.vue';
import { useDataTable } from './useDataTable';

interface Call {
  id: string;
}

const calls: Call[] = Array.from({ length: 25 }, (_, index) => ({ id: `call-${index + 1}` }));

const columns: DataTableColumn<Call>[] = [{ accessorKey: 'id', header: 'Call' }];

type TableOptions = Omit<UseDataTableOptions<Call>, 'columns'>;

function mountPagination(tableOptions: TableOptions, parts = '<DataTablePaginationPages />') {
  const Host = defineComponent({
    components: { DataTable, DataTablePagination, DataTablePaginationPages, DataTablePaginationPageSizeSelect },
    setup() {
      return { table: useDataTable({ columns, ...tableOptions }) };
    },
    template: `
      <div>
        <DataTablePagination :table="table">${parts}</DataTablePagination>
        <DataTable :table="table" />
      </div>
    `,
  });

  return mount(Host);
}

type Wrapper = ReturnType<typeof mountPagination>;

function callIds(wrapper: Wrapper) {
  return wrapper.findAll('tbody td').map(cell => cell.text());
}

function paginationButtons(wrapper: Wrapper) {
  return wrapper.findAll('[data-slot="data-table-pagination"] nav button').map(button => button.text() || button.attributes('aria-label'));
}

function isPaginationVisible(wrapper: Wrapper) {
  return wrapper.get('[data-slot="data-table-pagination"]').isVisible();
}

async function choosePageSize(wrapper: Wrapper, pageSize: string) {
  await wrapper.get('[data-slot="select-trigger"]').trigger('keydown', { key: 'Enter' });
  await flushPromises();
  await new DOMWrapper(document.body).getElementByText('[role="option"]', pageSize).trigger('keydown', { key: 'Enter' });
}

describe('dataTablePagination', () => {
  it('should move between the pages', async () => {
    const pagination = ref<DataTablePaginationState>({ pageIndex: 0, pageSize: 10 });
    const wrapper = mountPagination({ data: calls, pagination });

    await wrapper.getElementByText('[data-slot="pagination-item"]', '3').trigger('click');

    expect(pagination.value).toEqual({ pageIndex: 2, pageSize: 10 });
    expect(callIds(wrapper)).toEqual(['call-21', 'call-22', 'call-23', 'call-24', 'call-25']);

    await wrapper.get('[data-slot="pagination-previous"]').trigger('click');

    expect(pagination.value.pageIndex).toBe(1);
    expect(wrapper.get('[aria-current="page"]').text()).toBe('2');
  });

  describe('pages', () => {
    const serverPage = {
      data: calls.slice(0, 10),
      serverSide: true,
      totalRowCount: 95,
      pagination: ref({ pageIndex: 4, pageSize: 10 }),
    };

    it('should show the labelled previous and next buttons and the edge pages by default', () => {
      const wrapper = mountPagination(serverPage);

      expect(paginationButtons(wrapper)).toEqual(['Previous', '1', '4', '5', '6', '10', 'Next']);
      expect(callIds(wrapper)).toHaveLength(10);
    });

    it('should show the first and last buttons as icons and five pages around the current one in the compact variant', () => {
      const wrapper = mountPagination(serverPage, '<DataTablePaginationPages variant="compact" />');

      expect(paginationButtons(wrapper)).toEqual(['First', 'Previous', '3', '4', '5', '6', '7', 'Next', 'Last']);
    });
  });

  describe('page size select', () => {
    const withPageSizeSelect = '<DataTablePaginationPages /><DataTablePaginationPageSizeSelect :options="[10, 20]" />';

    it('should go back to the first page when the page size changes', async () => {
      const pagination = ref<DataTablePaginationState>({ pageIndex: 2, pageSize: 10 });
      const wrapper = mountPagination({ data: calls, pagination }, withPageSizeSelect);

      await choosePageSize(wrapper, '20');

      expect(pagination.value).toEqual({ pageIndex: 0, pageSize: 20 });
      expect(paginationButtons(wrapper)).toEqual(['Previous', '1', '2', 'Next']);
    });

    it('should name the select for a screen reader without a visible label', async () => {
      const wrapper = mountPagination({ data: calls, pagination: ref({ pageIndex: 0, pageSize: 10 }) }, withPageSizeSelect);
      await flushPromises();

      const trigger = wrapper.get('button[data-slot="select-trigger"]');

      expect(trigger.attributes('aria-label')).toBe('Rows per page');
      expect(trigger.text()).toBe('10');
    });
  });

  describe('when every row fits on one page', () => {
    it('should hide without a pagination ref', () => {
      const wrapper = mountPagination({ data: calls });

      expect(isPaginationVisible(wrapper)).toBe(false);
    });

    it('should hide when the rows fit on the page', () => {
      const wrapper = mountPagination({ data: calls.slice(0, 10), pagination: ref({ pageIndex: 0, pageSize: 10 }) });

      expect(isPaginationVisible(wrapper)).toBe(false);
    });

    it('should stay while the page size select offers a size that splits the rows', async () => {
      const wrapper = mountPagination(
        { data: calls, pagination: ref({ pageIndex: 0, pageSize: 50 }) },
        '<DataTablePaginationPages /><DataTablePaginationPageSizeSelect :options="[10, 50]" />',
      );
      await flushPromises();

      expect(isPaginationVisible(wrapper)).toBe(true);
    });
  });
});
