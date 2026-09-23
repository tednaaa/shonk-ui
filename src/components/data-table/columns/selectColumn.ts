import type { DataTableSelectColumn } from '../types';

export function selectColumn(): DataTableSelectColumn {
  return { kind: 'select', id: 'select' };
}
