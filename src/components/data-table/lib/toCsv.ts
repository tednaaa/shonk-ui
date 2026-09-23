import type { DataTableExportValue } from '../types';
import type { DataTableExportData } from './exportRows';

const byteOrderMark = '﻿';

const delimiter = ';';

const needsQuotes = /["\n\r;]/;

export function toCsv({ header, rows }: DataTableExportData): string {
  return byteOrderMark + [header, ...rows].map(toCsvRow).join('\r\n');
}

function toCsvRow(row: DataTableExportValue[]): string {
  return row.map(toCsvValue).join(delimiter);
}

function toCsvValue(value: DataTableExportValue): string {
  if (value === null || value === undefined)
    return '';

  const text = String(value);

  return needsQuotes.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
