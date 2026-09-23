import type { DataTableColumn } from './types';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import writeXlsxFile from 'write-excel-file/browser';
import { downloadBlob } from '@/lib/file';
import { useDataTable } from './useDataTable';
import { useDataTableExport } from './useDataTableExport';

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
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'amount', header: 'Amount' },
];

const xlsxBlob = new Blob(['xlsx']);

enableAutoUnmount(afterEach);

beforeEach(() => {
  vi.mocked(writeXlsxFile).mockReturnValue({ toBlob: () => Promise.resolve(xlsxBlob), toFile: () => Promise.resolve() });
});

function mountExport(fileName = ref<string | undefined>(), sheetName = ref<string | undefined>()) {
  const Host = defineComponent({
    setup() {
      const table = useDataTable({ data: deals, columns, getRowId: deal => deal.id });

      return useDataTableExport(table, { fileName, sheetName });
    },
    template: '<div />',
  });

  return mount(Host);
}

function downloaded() {
  const [blob, fileName] = vi.mocked(downloadBlob).mock.lastCall ?? [];

  return { blob, fileName };
}

describe('useDataTableExport', () => {
  it('should download the shown rows as CSV named after the table', async () => {
    await mountExport().vm.downloadTable('csv');

    const { blob, fileName } = downloaded();

    expect(fileName).toBe('table.csv');
    expect(await blob?.text()).toBe('Client;Amount\r\nAlpha;1200\r\nBeta;900');
  });

  it('should write the same rows into an xlsx sheet', async () => {
    await mountExport(ref('deals'), ref('Deals')).vm.downloadTable('xlsx');

    expect(writeXlsxFile).toHaveBeenCalledWith([['Client', 'Amount'], ['Alpha', 1200], ['Beta', 900]], { sheet: 'Deals' });
    expect(downloaded()).toEqual({ blob: xlsxBlob, fileName: 'deals.xlsx' });
  });

  it('should read the file name and the sheet name at the moment of the call', async () => {
    const fileName = ref<string | undefined>('deals');
    const sheetName = ref<string | undefined>('Deals');
    const wrapper = mountExport(fileName, sheetName);

    fileName.value = 'report';
    sheetName.value = 'Report';
    await wrapper.vm.downloadTable('xlsx');

    expect(writeXlsxFile).toHaveBeenCalledWith(expect.anything(), { sheet: 'Report' });
    expect(downloaded().fileName).toBe('report.xlsx');
  });

  it('should drop from the sheet name the characters Excel refuses and cut it to 31 characters', async () => {
    await mountExport(ref('deals'), ref('Project 12/2026 — deals for the whole of last year')).vm.downloadTable('xlsx');

    expect(writeXlsxFile).toHaveBeenCalledWith(expect.anything(), { sheet: 'Project 12 2026 — deals for the' });
  });

  it('should leave the sheet unnamed when the name is left empty', async () => {
    await mountExport(ref('deals'), ref('[*]')).vm.downloadTable('xlsx');

    expect(writeXlsxFile).toHaveBeenCalledWith(expect.anything(), { sheet: undefined });
  });
});
