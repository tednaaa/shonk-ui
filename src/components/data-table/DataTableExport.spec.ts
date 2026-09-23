import type { DataTableColumn, DataTableExportFormat } from './types';
import { DOMWrapper, enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import writeXlsxFile from 'write-excel-file/browser';
import { downloadBlob } from '@/lib/file';
import { selectColumn } from './columns/selectColumn';
import DataTable from './DataTable.vue';
import DataTableExport from './DataTableExport.vue';
import { useDataTable } from './useDataTable';

vi.mock('@/lib/file', () => ({ downloadBlob: vi.fn() }));

vi.mock('write-excel-file/browser', () => ({ default: vi.fn() }));

interface Deal {
  id: string;
  client: string;
  amount: number;
}

const deals: Deal[] = [
  { id: '1', client: 'Alpha', amount: 1200 },
  { id: '2', client: 'Beta', amount: 900 },
];

const columns: DataTableColumn<Deal>[] = [
  selectColumn(),
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'amount', header: 'Amount' },
];

const xlsxBlob = new Blob(['xlsx']);

enableAutoUnmount(afterEach);

const body = new DOMWrapper(document.body);

const errorHandler = vi.fn();

beforeEach(() => {
  vi.mocked(writeXlsxFile).mockReturnValue({ toBlob: () => Promise.resolve(xlsxBlob), toFile: () => Promise.resolve() });
});

function mountExport(exportProps: { fileName?: string; sheetName?: string; formats?: DataTableExportFormat[]; disabled?: boolean } = {}) {
  const Host = defineComponent({
    components: { DataTable, DataTableExport },
    setup() {
      return { table: useDataTable({ data: deals, columns, getRowId: deal => deal.id }), exportProps };
    },
    template: `
      <div>
        <DataTableExport :table="table" v-bind="exportProps" />
        <DataTable :table="table" />
      </div>
    `,
  });

  return mount(Host, { attachTo: document.body, global: { config: { errorHandler } } });
}

type Wrapper = ReturnType<typeof mountExport>;

async function chooseFormat(wrapper: Wrapper, format: string) {
  await wrapper.getElementByText('button', 'Download').trigger('click');
  await flushPromises();

  await body.getElementByText('[data-slot="dropdown-menu-item"]', format).trigger('click');
  await flushPromises();
}

function downloaded() {
  const [blob, fileName] = vi.mocked(downloadBlob).mock.lastCall ?? [];

  return { blob, fileName };
}

describe('dataTableExport', () => {
  it('should download the shown rows as CSV named after the table', async () => {
    await chooseFormat(mountExport(), 'CSV');

    const { blob, fileName } = downloaded();

    expect(fileName).toBe('table.csv');
    expect(await blob?.text()).toBe('Client;Amount\r\nAlpha;1200\r\nBeta;900');
    expect(blob?.type).toBe('text/csv;charset=utf-8');
  });

  it('should write the same rows into an xlsx sheet', async () => {
    await chooseFormat(mountExport({ fileName: 'deals', sheetName: 'Deals' }), 'XLSX');

    expect(writeXlsxFile).toHaveBeenCalledWith([['Client', 'Amount'], ['Alpha', 1200], ['Beta', 900]], { sheet: 'Deals' });
    expect(downloaded()).toEqual({ blob: xlsxBlob, fileName: 'deals.xlsx' });
  });

  it('should download right away when a single format is offered', async () => {
    const wrapper = mountExport({ formats: ['xlsx'] });

    await wrapper.getElementByText('button', 'Download XLSX').trigger('click');
    await flushPromises();

    expect(body.find('[data-slot="dropdown-menu-item"]').exists()).toBe(false);
    expect(downloaded().fileName).toBe('table.xlsx');
  });

  it('should not offer a format while the export is disabled', async () => {
    const wrapper = mountExport({ disabled: true });

    const trigger = wrapper.getElementByText('button', 'Download');

    expect(trigger.attributes('disabled')).toBeDefined();

    await trigger.trigger('click');
    await flushPromises();

    expect(body.find('[data-slot="dropdown-menu-item"]').exists()).toBe(false);
  });

  it('should not download from the single-format button while the export is disabled', async () => {
    const wrapper = mountExport({ formats: ['xlsx'], disabled: true });

    const button = wrapper.getElementByText('button', 'Download XLSX');

    expect(button.attributes('disabled')).toBeDefined();

    await button.trigger('click');
    await flushPromises();

    expect(downloadBlob).not.toHaveBeenCalled();
  });

  it('should hand an export that failed to the app instead of swallowing it', async () => {
    const failure = new Error('sheet name is not a string');
    vi.mocked(writeXlsxFile).mockImplementation(() => {
      throw failure;
    });

    await chooseFormat(mountExport(), 'XLSX');

    expect(errorHandler.mock.lastCall?.[0]).toBe(failure);
    expect(downloadBlob).not.toHaveBeenCalled();
  });
});
