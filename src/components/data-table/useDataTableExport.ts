import type { MaybeRefOrGetter } from 'vue';
import type { DataTableExportData } from './lib/exportRows';
import type { DataTableExportFormat, DataTableInstance } from './types';
import { toValue } from 'vue';
import { downloadBlob } from '@/lib/file';
import { useLocale } from '@/locales';
import { exportRows } from './lib/exportRows';
import { toCsv } from './lib/toCsv';

const illegalSheetNameCharacters = /[[\]/\\:*?]+/g;

const maxSheetNameLength = 31;

function toSheetName(name: string | undefined): string | undefined {
  const sheetName = name?.replaceAll(illegalSheetNameCharacters, ' ').slice(0, maxSheetNameLength).trim();

  return sheetName || undefined;
}

export interface UseDataTableExportOptions {
  fileName?: MaybeRefOrGetter<string | undefined>;
  sheetName?: MaybeRefOrGetter<string | undefined>;
}

export function useDataTableExport<TData extends object>(
  table: MaybeRefOrGetter<DataTableInstance<TData>>,
  options: UseDataTableExportOptions = {},
) {
  const locale = useLocale();

  async function toBlob(format: DataTableExportFormat, data: DataTableExportData): Promise<Blob> {
    if (format === 'csv')
      return new Blob([toCsv(data)], { type: 'text/csv;charset=utf-8' });

    const { default: writeXlsxFile } = await import('write-excel-file/browser');

    return writeXlsxFile([data.header, ...data.rows], { sheet: toSheetName(toValue(options.sheetName)) }).toBlob();
  }

  async function downloadTable(format: DataTableExportFormat) {
    const data = exportRows(toValue(table));
    const fileName = toValue(options.fileName) ?? locale.value.dataTable.exportFileName;

    downloadBlob(await toBlob(format, data), `${fileName}.${format}`);
  }

  return { downloadTable };
}
