import type { DataTableExpandColumn } from '../types';

export function expandColumn(): DataTableExpandColumn {
  return { kind: 'expand', id: 'expand' };
}
