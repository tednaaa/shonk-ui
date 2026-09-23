import type { DataTableInstance } from '../types';
import type { KitTable } from './features';
import { markRaw } from 'vue';

const tableKey = Symbol('data-table');

interface KitDataTableInstance<TData extends object> extends DataTableInstance<TData> {
  readonly [tableKey]: KitTable<TData>;
}

export function createDataTableInstance<TData extends object>(table: KitTable<TData>): DataTableInstance<TData> {
  const instance: KitDataTableInstance<TData> = { [tableKey]: table };

  return markRaw(instance);
}

export function unwrapDataTable<TData extends object>(instance: DataTableInstance<TData>): KitTable<TData> {
  if (!isKitDataTableInstance(instance))
    throw new TypeError('DataTable expects the table returned by useDataTable');

  return instance[tableKey];
}

function isKitDataTableInstance<TData extends object>(instance: DataTableInstance<TData>): instance is KitDataTableInstance<TData> {
  return tableKey in instance;
}
